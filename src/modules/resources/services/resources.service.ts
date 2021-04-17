import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/models/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateResourceDto } from '../models/dto/create-resource.dto';
import { UpdateResourceDto } from '../models/dto/update-resource.dto';
import { Resource } from '../models/entities/resource.entity';
import { Visibility } from '../../visibility/models/entity/visibility.entity';
import { ResourceType } from '../models/entities/resource-type.entity';
import { ConfigService } from '@nestjs/config';
import { ResourceGroupByResourceType } from '../interfaces/resource-group-by-resourceType';
import { S3FileService } from '../../aws/s3/services/s3-file.service';
import { Wonder } from '../../wonders/models/entities/wonder.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ResourceHelper } from '../helpers/resource-helper';
import Collection from '../../core/interfaces/collection/collection.interface';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(Wonder)
    private wonderRepository: Repository<Wonder>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Visibility)
    private visibilityRepository: Repository<Visibility>,
    @InjectRepository(ResourceType)
    private resourceTypeRepository: Repository<ResourceType>,
    private configService: ConfigService,
    private s3FileService: S3FileService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private resourceHelper: ResourceHelper,
  ) {}

  async create(
    createResourceDto: CreateResourceDto,
  ): Promise<Resource | undefined> {
    const user = await this.userRepository.findOne(createResourceDto.userId);
    const resourceType = await this.resourceTypeRepository.findOne(
      createResourceDto.resourceTypeId,
    );
    const visibility = await this.visibilityRepository.findOne(
      createResourceDto.visibilityTypeId,
    );
    const wonder = await this.wonderRepository.findOne({
      where: {
        id: createResourceDto.wonderId,
        user: user,
      },
    });

    if (!resourceType)
      throw new BadRequestException({ message: 'Resource type not found' });

    if (!visibility)
      throw new BadRequestException({ message: 'Visibility type not found' });

    if (createResourceDto.wonderId && !wonder)
      throw new BadRequestException({ message: 'Wonder not found' });

    let s3Image = null;
    let s3AudioClip = null;
    if (createResourceDto.image) {
      s3Image = await this.s3FileService.uploadPublicFile(
        createResourceDto.image.buffer,
        createResourceDto.image.originalname,
        'resource/images',
      );
    }
    if (createResourceDto.audioClip) {
      s3AudioClip = await this.s3FileService.uploadPublicFile(
        createResourceDto.audioClip.buffer,
        createResourceDto.audioClip.originalname,
        'resource/audioClips',
      );
    }

    const keywords = createResourceDto.keywords;
    const keywordsString = keywords ? keywords.join() : '';

    const resource = await this.resourceRepository.save({
      title: createResourceDto.title,
      description: createResourceDto.description,
      user: user,
      visibility: visibility,
      resourceType: resourceType,
      wonder: wonder,
      imageLink: s3Image ? s3Image.key : null,
      audioClipLink: s3AudioClip ? s3AudioClip.key : null,
      url: createResourceDto.url,
      urlImage: createResourceDto.urlImage,
      keywords: keywordsString,
      isSpecial: createResourceDto.isSpecial === 'true',
    });

    return resource;
  }

  /**
   * @param string userId
   */
  async findAll(
    userId: string = null,
    query: {
      pageSize: number;
      pageNumber: number;
      resourceTypeId: number;
      wonderId: number;
    },
  ): Promise<Collection | undefined> {
    const user = await this.getUser(userId);
    const pageSize = query.pageSize
      ? query.pageSize
      : parseInt(this.configService.get('DEFAULT_PAGINATION_VALUE'));
    const pageNumber = query.pageNumber ?? 1;

    const skippedItems = (pageNumber - 1) * pageSize;

    const totalCount = await this.resourceRepository.count({
      where: { ...(user && { user: user }) },
    });

    let sqlQuery = await this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.resourceType', 'resoureceType')
      .leftJoinAndSelect('resource.visibility', 'visibility')
      .leftJoinAndSelect('resource.wonder', 'wonder')
      .where('resource.userId = :userId', { userId: userId });

    if (query.resourceTypeId)
      sqlQuery = sqlQuery.where('resource.resourceTypeId = :resourceTypeId', {
        resourceTypeId: query.resourceTypeId,
      });

    if (query.wonderId) {
      sqlQuery = sqlQuery.where('resource.wonderId = :wonderId', {
        wonderId: query.wonderId,
      });
    }

    const resources = await sqlQuery
      .take(pageSize)
      .skip(skippedItems)
      .getMany();

    const result = resources.map((item) => {
      return this.resourceHelper.prepareResourceAfterFetch(item);
    });

    return {
      items: result,
      pageNumber:
        typeof pageNumber === 'string' ? parseInt(pageNumber) : pageNumber,
      pageSize: typeof pageSize === 'string' ? parseInt(pageSize) : pageSize,
      totalCount: totalCount,
    };
  }

  /**
   *
   * @param string id
   * @param user userId
   */
  async findOne(
    id: number,
    userId: string = null,
    withRelation = true,
  ): Promise<Resource | any> {
    const user = await this.getUser(userId);
    const resource = await this.resourceRepository.findOne(id, {
      relations: withRelation ? ['resourceType', 'visibility', 'user'] : [],
      where: { ...(user && { user: user }) },
    });
    if (!resource) throw new NotFoundException();
    return this.resourceHelper.prepareResourceAfterFetch(resource);
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.resourceRepository.findOne(id, {
      relations: ['user'],
    });
    if (!resource) throw new NotFoundException('Resource not found!');

    const user = await this.userRepository.findOne(updateResourceDto.userId);

    if (resource.user.id !== user.id) throw new UnauthorizedException(); //resource user must be equal to user who is updating it, otherwise throw unauthorized exception

    const resourceType = await this.resourceTypeRepository.findOne(
      updateResourceDto.resourceTypeId,
    );
    const visibility = await this.visibilityRepository.findOne(
      updateResourceDto.visibilityTypeId,
    );

    if (!resourceType)
      throw new BadRequestException({ message: 'Resource type not found' });

    if (!visibility)
      throw new BadRequestException({
        message: 'Visibility type not found',
      });

    let s3Image = null;
    let s3AudioClip = null;
    if (updateResourceDto.image) {
      s3Image = await this.s3FileService.uploadPublicFile(
        updateResourceDto.image.buffer,
        updateResourceDto.image.originalname,
        'resource/images',
      );
    }
    if (updateResourceDto.audioClip) {
      s3AudioClip = await this.s3FileService.uploadPublicFile(
        updateResourceDto.audioClip.buffer,
        updateResourceDto.audioClip.originalname,
        'resource/audioClips',
      );
    }

    let imageLink = null;
    let audioClipLink = null;
    if (updateResourceDto.imageLink) imageLink = updateResourceDto.imageLink;
    if (updateResourceDto.audioClipLink)
      audioClipLink = updateResourceDto.audioClipLink;

    const keywords = updateResourceDto.keywords;
    const keywordsString = keywords ? keywords.join() : '';

    resource.title = updateResourceDto.title;
    resource.url = updateResourceDto.url;
    resource.user = user;
    resource.visibility = visibility;
    resource.description = updateResourceDto.description;
    resource.imageLink = s3Image ? s3Image.key : imageLink;
    resource.audioClipLink = s3AudioClip ? s3AudioClip.key : audioClipLink;
    resource.urlImage = updateResourceDto.urlImage;
    resource.isSpecial = updateResourceDto.isSpecial === 'true';
    resource.keywords = keywordsString;
    const result = await this.resourceRepository.save(resource);
    return result;
  }

  async remove(id: number, userId: string = null) {
    const user = await this.getUser(userId);
    const resource = await this.resourceRepository.findOne(id, {
      relations: ['user'],
    });

    if (!resource) throw new NotFoundException();

    if (user) {
      if (resource.user.id !== user.id) throw new UnauthorizedException(); //resource user must be equal to user who is deleting it, otherwise throw unauthorized exception
    }

    const result = await this.resourceRepository.delete(id);
    if (result && result.affected === 0) throw new NotFoundException();
    return result;
  }

  async groupResourcesByResourceType(
    userId: string,
  ): Promise<Array<ResourceGroupByResourceType>> {
    const resourceTypes = await this.resourceTypeRepository.find({});
    const resourceGroupData = [];
    const user = await this.getUser(userId);

    await Promise.all(
      resourceTypes.map(async (item) => {
        const data: ResourceGroupByResourceType = {
          id: item.id,
          type: item.type,
          resources: await this.getResourcesByResourceType(item, user, 3),
        };
        resourceGroupData.push(data);
        return item;
      }),
    );

    return resourceGroupData;
  }

  async getResourcesByResourceType(
    resourceType: ResourceType,
    user: User,
    limit = 3,
  ) {
    const resources = await this.resourceRepository.find({
      where: { resourceType: resourceType, user: user },
      order: { id: 'DESC' },
      take: limit,
    });

    resources.map((item) => {
      item.resourceType = resourceType;
      return this.resourceHelper.prepareResourceAfterFetch(item);
    });

    return resources;
  }

  async getUserLatestResourceByWonderId(userId: number, wonderId: number) {
    const resource = await this.resourceRepository
      .createQueryBuilder('resource')
      .where('resource.userId = :userId', { userId: userId })
      .where('resource.wonderId = :wonderId', { wonderId: wonderId })
      .orderBy('resource.id', 'DESC')
      .getOne();

    return resource;
  }

  async getUser(userId): Promise<User | null> {
    if (!userId) return null;
    const user = this.userRepository.findOne(userId);
    return user;
  }
}
