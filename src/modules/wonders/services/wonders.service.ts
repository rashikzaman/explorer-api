import {
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
import { VisibilityService } from '../../visibility/services/visibility.service';
import { ResourcesService } from '../../resources/services/resources.service';
import { ResourceHelper } from '../../resources/helpers/resource-helper';

@Injectable()
export class WondersService {
  constructor(
    @InjectRepository(Wonder)
    private wonderRepository: Repository<Wonder>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private visibilityService: VisibilityService,
    private resourceService: ResourcesService,
    private resourceHelper: ResourceHelper,
  ) {}

  async create(createWonderDto: CreateWonderDto): Promise<Wonder | undefined> {
    const user = await this.getUser(createWonderDto.userId);
    const visibility = await this.visibilityService.getVisibility(
      createWonderDto.visibilityId,
    );

    const wonder = await this.wonderRepository.save({
      title: createWonderDto.title,
      description: createWonderDto.description,
      coverPhotoUrl: createWonderDto.coverPhoto,
      visibility: visibility,
      user: user,
    });
    return wonder;
  }

  async findAll(userId: string): Promise<Wonder[] | undefined> {
    let sqlQuery = this.wonderRepository
      .createQueryBuilder('wonder')
      .where('wonder.userId = :userId', { userId: userId });

    sqlQuery = sqlQuery
      .leftJoinAndSelect('wonder.visibility', 'visibility')
      .leftJoinAndSelect('wonder.resources', 'resources')
      .loadRelationCountAndMap('wonder.resourcesCount', 'wonder.resources');

    const wonders = await sqlQuery.getMany();
    await Promise.all(
      wonders.map(async (wonder) => {
        wonder.coverPhotoUrl = await this.addCoverPhotoOfWonder(
          wonder.id,
          +userId,
        );
      }),
    );
    return wonders;
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
        .leftJoinAndSelect('wonder.visibility', 'visibility')
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
    const visibility = await this.visibilityService.getVisibility(
      updateWonderDto.visibilityId,
    );

    if (!visibility) throw new NotFoundException('Visiblity type not found');

    wonder.title = updateWonderDto.title;
    wonder.description = updateWonderDto.description;
    wonder.coverPhotoUrl = updateWonderDto.coverPhoto ?? wonder.coverPhotoUrl; // if request converphoto is null, don't insert it
    wonder.visibility = visibility;
    wonder.updatedAt = new Date();
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

  async getUser(userId): Promise<User | null> {
    if (!userId) return null;
    const user = this.userRepository.findOne(userId);
    return user;
  }
}
