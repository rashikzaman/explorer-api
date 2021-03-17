import {
  BadRequestException,
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
import { ResourceKeyword } from '../models/entities/resource-keyword.entity';
import { ResourceKeywordsService } from './resource-keywords.service';
import { ConfigService } from '@nestjs/config';
import { S3FileService } from '../../aws/s3/services/s3-file.service';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Visibility)
    private visibilityRepository: Repository<Visibility>,
    @InjectRepository(ResourceType)
    private resourceTypeRepository: Repository<ResourceType>,
    @InjectRepository(ResourceKeyword)
    private resourceKeywordRepository: Repository<ResourceKeyword>,
    private resourceKeywordsService: ResourceKeywordsService,
    private configService: ConfigService,
    private s3FileService: S3FileService,
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

    if (!resourceType)
      throw new BadRequestException({ message: 'Resource type not found' });

    if (!visibility)
      throw new BadRequestException({ message: 'Visibility type not found' });

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

    const resource = await this.resourceRepository.save({
      title: createResourceDto.title,
      description: createResourceDto.description,
      user: user,
      visibility: visibility,
      resourceType: resourceType,
      imageLink: s3Image ? s3Image.key : null,
      audioClipLink: s3AudioClip ? s3AudioClip.key : null,
      url: createResourceDto.url,
      urlImage: createResourceDto.urlImage,
    });

    await this.resourceKeywordsService.create(
      createResourceDto.keywords,
      resource,
    );
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
    },
  ): Promise<Collection | undefined> {
    const user = await this.getUser(userId);
    const pageSize = query.pageSize
      ? query.pageSize
      : parseInt(this.configService.get('DEFAULT_PAGINATION_VALUE'));
    const pageNumber = query.pageNumber ?? 1;

    const skippedItems = (pageNumber - 1) * query.pageSize;

    const totalCount = await this.resourceRepository.count({
      where: { ...(user && { user: user }) },
    });
    const resources = await this.resourceRepository.find({
      relations: ['resourceType', 'visibility', 'user'],
      where: { ...(user && { user: user }) },
      take: pageSize,
      skip: skippedItems,
    });

    const result = resources.map((item) => {
      item.imageLink = item.imageLink
        ? this.configService.get('HOST_API') + item.imageLink
        : null;
      item.audioClipLink = item.audioClipLink
        ? this.configService.get('HOST_API') + item.audioClipLink
        : null;
      return item;
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
  async findOne(id: number, userId: string = null): Promise<Resource | any> {
    const user = await this.getUser(userId);
    const resource = await this.resourceRepository.findOne(id, {
      relations: ['resourceType', 'visibility', 'user', 'resourceKeywords'],
      where: { ...(user && { user: user }) },
    });
    resource.imageLink = resource.imageLink
      ? this.configService.get('HOST_API') + resource.imageLink
      : null;
    resource.audioClipLink = resource.audioClipLink
      ? this.configService.get('HOST_API') + resource.audioClipLink
      : null;
    if (!resource) throw new NotFoundException();
    return resource;
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

    resource.title = updateResourceDto.title;
    resource.url = updateResourceDto.url;
    resource.user = user;
    resource.visibility = visibility;
    resource.description = updateResourceDto.description;
    resource.imageLink = s3Image ? s3Image.key : imageLink;
    resource.audioClipLink = s3AudioClip ? s3AudioClip.key : audioClipLink;
    resource.urlImage = updateResourceDto.urlImage;
    const result = await this.resourceRepository.save(resource);

    this.resourceKeywordsService.update(updateResourceDto.keywords, result);

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

  async getUser(userId): Promise<User | null> {
    if (!userId) return null;
    const user = this.userRepository.findOne(userId);
    return user;
  }
}
