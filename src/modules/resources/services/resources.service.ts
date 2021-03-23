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
import { ResourceGroupByResourceType } from '../interfaces/resource-group-by-resourceType';
import { use } from 'passport';

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

    const resource = await this.resourceRepository.save({
      title: createResourceDto.title,
      description: createResourceDto.description,
      user: user,
      visibility: visibility,
      resourceType: resourceType,
      imageLink: createResourceDto.image,
      audioClipLink: createResourceDto.audioClip,
      url: createResourceDto.url,
      urlImage: createResourceDto.urlImage,
    });

    const resourceKeywords = await this.resourceKeywordsService.create(
      createResourceDto.keywords,
      resource,
    );
    return resource;
  }

  /**
   * @param string userId
   */
  async findAll(userId: string = null): Promise<Resource[] | undefined> {
    const user = await this.getUser(userId);

    const resources = await this.resourceRepository.find({
      relations: ['resourceType', 'visibility', 'user'],
      where: { ...(user && { user: user }) },
    });

    const result = resources.map((item) => {
      return this.prepareResourceAfterFetch(item);
    });

    return result;
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
    if (!resource) throw new NotFoundException();
    return this.prepareResourceAfterFetch(resource);
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

    resource.title = updateResourceDto.title;
    resource.url = updateResourceDto.url;
    resource.user = user;
    resource.visibility = visibility;
    resource.description = updateResourceDto.description;
    resource.imageLink = updateResourceDto.image;
    resource.audioClipLink = updateResourceDto.audioClip;
    resource.urlImage = updateResourceDto.urlImage;
    const result = await this.resourceRepository.save(resource);

    const resourceKeywords = this.resourceKeywordsService.update(
      updateResourceDto.keywords,
      result,
    );

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
      return item;
    });

    return resources;
  }

  prepareResourceAfterFetch(resource: Resource) {
    resource.imageLink = resource.imageLink
      ? this.configService.get('HOST_API') + resource.imageLink
      : null;
    resource.audioClipLink = resource.audioClipLink
      ? this.configService.get('HOST_API') + resource.audioClipLink
      : null;
    return resource;
  }

  async getUser(userId): Promise<User | null> {
    if (!userId) return null;
    const user = this.userRepository.findOne(userId);
    return user;
  }
}
