import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  private defaultWonderTitle;
  constructor(
    @InjectRepository(Wonder)
    private readonly wonderRepository: Repository<Wonder>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => ResourcesService))
    private readonly resourceService: ResourcesService,
    private readonly resourceHelper: ResourceHelper,
    private readonly configService: ConfigService,
    private readonly visibilityService: VisibilityService,
  ) {
    this.defaultWonderTitle = 'Other';
  }

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
    userId: number,
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
    if (wonder)
      wonder.coverPhotoUrl = await this.addCoverPhotoOfWonder(
        wonder.id,
        +userId,
      );
    return wonder;
  }

  async update(
    id: number,
    updateWonderDto: UpdateWonderDto,
  ): Promise<Wonder | undefined> {
    const wonder = await this.findOne(id, updateWonderDto.userId);

    let visibility = null;

    if (updateWonderDto.visibilityTypeId) {
      visibility = await this.visibilityService.findOne(
        updateWonderDto.visibilityTypeId,
      );
      if (!visibility) throw new NotFoundException('Visibility Type not found');
    } else visibility = wonder.visibility;

    wonder.title = updateWonderDto.title;
    wonder.description = updateWonderDto.description;
    wonder.coverPhotoUrl = updateWonderDto.coverPhoto ?? wonder.coverPhotoUrl; // if request converphoto is null, don't insert it
    wonder.updatedAt = new Date();
    wonder.visibility = visibility;
    const result = await this.wonderRepository.save(wonder);
    return result;
  }

  async remove(id: number, userId: string): Promise<any> {
    await this.findOne(id, +userId);
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

  async getAllCommonWonders(query: {
    pageSize: number;
    pageNumber: number;
  }): Promise<Collection | undefined> {
    const pageSize = query.pageSize
      ? query.pageSize
      : parseInt(this.configService.get('DEFAULT_PAGINATION_VALUE'));
    const pageNumber = query.pageNumber ?? 1;

    const skippedItems = (pageNumber - 1) * pageSize;

    const sqlQuery = this.wonderRepository
      .createQueryBuilder('wonder')
      .groupBy('wonder.title')
      .where('wonder.visibilityId = :visiblityId', { visiblityId: 2 })
      .orderBy('wonder.title', 'ASC');

    const wonders = await sqlQuery.take(pageSize).skip(skippedItems).getMany();
    const totalCount = await sqlQuery.getCount();

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

    return {
      items: data,
      pageNumber:
        typeof pageNumber === 'string' ? parseInt(pageNumber) : pageNumber,
      pageSize: typeof pageSize === 'string' ? parseInt(pageSize) : pageSize,
      totalCount: totalCount,
    };
  }

  async getCommonWonder(title: string): Promise<any> {
    const sqlQuery = this.wonderRepository
      .createQueryBuilder('wonder')
      .where('wonder.title = :title', { title: title })
      .where('wonder.visibilityId = :visiblityId', { visiblityId: 2 });

    const wonders = await sqlQuery.getMany();
    const data = [];
    const wonderIds = wonders.map((item) => item.id);
    const resources = await this.resourceService.getResourcesWithWonderIds(
      wonderIds,
    );

    data.push({
      title: title,
      resources: resources,
      resourcesCount: resources.length,
    });

    return data;
  }

  async getOrCreateDefaultWonder(userId: number): Promise<Wonder | undefined> {
    const defaultWonderTitle = this.defaultWonderTitle;
    const wonder = await this.wonderRepository.findOne({
      where: { userId: userId, title: defaultWonderTitle },
    });

    if (!wonder) {
      const privateVisibility = await this.visibilityService.getPrivateVisibility(); //make default wonder private
      const wonder = await this.wonderRepository.save({
        title: defaultWonderTitle,
        userId: userId,
        visibility: privateVisibility,
      });
      return wonder;
    }
    return wonder;
  }

  async getUser(userId): Promise<User | null> {
    if (!userId) return null;
    const user = await this.userRepository.findOne(userId);
    return user;
  }
}
