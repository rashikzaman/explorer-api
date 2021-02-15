import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    });

    return resource;
  }

  async findAll(): Promise<Resource[] | undefined> {
    const result = await this.resourceRepository.find({
      relations: ['resourceType', 'visibility'],
    });
    return result;
  }

  async findOne(id: number): Promise<Resource | any> {
    const resource = await this.resourceRepository.findOne(id, {
      relations: ['resourceType', 'visibility'],
    });
    if (!resource) throw new NotFoundException();
    return resource;
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.resourceRepository.findOne(id);
    if (!resource) throw new NotFoundException('Resource not found!');

    const user = await this.userRepository.findOne(updateResourceDto.userId);
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
    const result = await this.resourceRepository.save(resource);

    return result;
  }

  async remove(id: number) {
    const result = await this.resourceRepository.delete(id);
    if (result && result.affected === 0) throw new NotFoundException();
    return result;
  }
}
