import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/models/user.entity';
import { Repository } from 'typeorm';
import { CreateResourceDto } from '../models/dto/create-resource.dto';
import { UpdateResourceDto } from '../models/dto/update-resource.dto';
import { Resource } from '../models/entities/resource.entity';
import { Visibility } from '../../visibility/models/entity/visibility.entity';
import { ResourceType } from '../models/entities/resource-type.entity';

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

    return resource;
  }

  /**
   * @param string userId
   */
  async findAll(userId: string = null): Promise<Resource[] | undefined> {
    const user = await this.getUser(userId);

    const result = await this.resourceRepository.find({
      relations: ['resourceType', 'visibility', 'user'],
      where: { ...(user && { user: user }) },
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
      relations: ['resourceType', 'visibility', 'user'],
      where: { ...(user && { user: user }) },
    });
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

    resource.title = updateResourceDto.title;
    resource.url = updateResourceDto.url;
    resource.user = user;
    resource.visibility = visibility;
    resource.description = updateResourceDto.description;
    resource.imageLink = updateResourceDto.image;
    resource.audioClipLink = updateResourceDto.audioClip;
    resource.urlImage = updateResourceDto.urlImage;
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

  async getUser(userId): Promise<User | null> {
    if (!userId) return null;
    const user = this.userRepository.findOne(userId);
    return user;
  }
}
