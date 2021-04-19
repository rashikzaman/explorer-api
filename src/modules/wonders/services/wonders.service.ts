import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateWonderDto } from '../models/dto/create-wonder.dto';
import { UpdateWonderDto } from '../models/dto/update-wonder.dto';
import { Wonder } from '../models/entities/wonder.entity';
import { User } from '../../users/models/entity/user.entity';
import { ResourcesService } from '../../resources/services/resources.service';
import { ResourceHelper } from '../../resources/helpers/resource-helper';
import { ConfigService } from '@nestjs/config';
import Collection from '../../core/interfaces/collection/collection.interface';
import { VisibilityService } from '../../visibility/services/visibility.service';

@Injectable()
export class WondersService {
  constructor(
    @InjectRepository(Wonder)
    private wonderRepository: Repository<Wonder>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private resourceService: ResourcesService,
    private resourceHelper: ResourceHelper,
    private configService: ConfigService,
    private visibilityService: VisibilityService,
  ) {}

  async create(createWonderDto: CreateWonderDto): Promise<Wonder | undefined> {
    const user = await this.getUser(createWonderDto.userId);
    const publicVisibility = await this.visibilityService.getPublicVisibility();

    const wonder = await this.wonderRepository.save({
      title: createWonderDto.title,
      description: createWonderDto.description,
      coverPhotoUrl: createWonderDto.coverPhoto,
      user: user,
      visibility: publicVisibility,
    });
    return wonder;
  }

  async findAll(
    userId: string,
    query: { pageSize: number; pageNumber: number },
  ): Promise<Collection | undefined> {
    const pageSize = query.pageSize
      ? query.pageSize
      : parseInt(this.configService.get('DEFAULT_PAGINATION_VALUE'));
    const pageNumber = query.pageNumber ?? 1;

    const skippedItems = (pageNumber - 1) * pageSize;

    let sqlQuery = this.wonderRepository
      .createQueryBuilder('wonder')
      .where('wonder.userId = :userId', { userId: userId });

    sqlQuery = sqlQuery
      .leftJoinAndSelect('wonder.resources', 'resources')
      .loadRelationCountAndMap('wonder.resourcesCount', 'wonder.resources');

    const totalCount = await sqlQuery.getCount();
    const wonders = await sqlQuery.take(pageSize).skip(skippedItems).getMany();
    await Promise.all(
      wonders.map(async (wonder) => {
        wonder.coverPhotoUrl = await this.addCoverPhotoOfWonder(
          wonder.id,
          +userId,
        );
      }),
    );

    return {
      items: wonders,
      pageNumber:
        typeof pageNumber === 'string' ? parseInt(pageNumber) : pageNumber,
      pageSize: typeof pageSize === 'string' ? parseInt(pageSize) : pageSize,
      totalCount: totalCount,
    };
  }

  async findOne(
    id: number,
    userId: string,
    withRelation = true,
  ): Promise<Wonder | undefined> {
    let sqlQuery = this.wonderRepository
      .createQueryBuilder('wonder')
      .where('wonder.userId = :userId', { userId: userId })
      .where('wonder.id = :id', { id: id });

    if (withRelation) {
      sqlQuery = sqlQuery
        .leftJoinAndSelect('wonder.resources', 'resources')
        .loadRelationCountAndMap('wonder.resourcesCount', 'wonder.resources');
    }

    const wonder = await sqlQuery.getOne();
    wonder.coverPhotoUrl = await this.addCoverPhotoOfWonder(wonder.id, +userId);
    return wonder;
  }

  async update(
    id: number,
    updateWonderDto: UpdateWonderDto,
  ): Promise<Wonder | undefined> {
    const wonder = await this.findOne(id, updateWonderDto.userId.toString());
    const publicVisibility = await this.visibilityService.getPublicVisibility();

    wonder.title = updateWonderDto.title;
    wonder.description = updateWonderDto.description;
    wonder.coverPhotoUrl = updateWonderDto.coverPhoto ?? wonder.coverPhotoUrl; // if request converphoto is null, don't insert it
    wonder.updatedAt = new Date();
    wonder.visibility = publicVisibility;
    const result = await this.wonderRepository.save(wonder);
    return result;
  }

  async remove(id: number, userId: string): Promise<any> {
    await this.findOne(id, userId);
    const result = await this.wonderRepository.delete(id);
    if (!result || result.affected === 0) throw new NotFoundException();
    return result;
  }

  async addCoverPhotoOfWonder(wonderId: number, userId: number) {
    const resource = await this.resourceService.getUserLatestResourceByWonderId(
      +userId,
      wonderId,
    );
    let coverPhotoUrl = null;
    if (resource) {
      if (resource.imageLink)
        coverPhotoUrl = this.resourceHelper.appendDomainToImageLink(resource);
      else if (resource.urlImage) coverPhotoUrl = resource.urlImage;
    }
    return coverPhotoUrl;
  }

  async getAllCommonWonders() {
    const wonders = await this.wonderRepository
      .createQueryBuilder('wonder')
      .groupBy('wonder.title')
      .where('wonder.visibilityId = :visiblityId', { visiblityId: 2 })
      .orderBy('wonder.title', 'ASC')
      .getMany();

    const data = [];

    await Promise.all(
      wonders.map(async (wonder) => {
        const wonders = await this.wonderRepository.find({
          title: wonder.title,
          visibilityId: 2,
        });
        const wonderIds = wonders.map((item) => item.id);
        const resources = await this.resourceService.getResourcesWithWonderIds(
          wonderIds,
        );

        data.push({
          title: wonder.title,
          resources: resources,
          resourcesCount: resources.length,
        });
      }),
    );

    return data;
  }

  async getUser(userId): Promise<User | null> {
    if (!userId) return null;
    const user = await this.userRepository.findOne(userId);
    return user;
  }
}
