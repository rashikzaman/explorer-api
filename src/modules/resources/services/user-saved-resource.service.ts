import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/models/entity/user.entity';
import { Brackets, In, Repository } from 'typeorm';
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
import { VisibilityService } from '../../visibility/services/visibility.service';
import { WondersService } from '../../wonders/services/wonders.service';
import { ResourceTypesService } from './resource-types.service';
import { CreateUserSavedUserResourceDto } from '../models/dto/create-user-saved-resource.dto';
import { DeleteUserSavedUserResourceDto } from '../models/dto/delete-user-saved-resource.dto';
import { ResourcesService } from './resources.service';

@Injectable()
export class UserSavedResourceService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    private s3FileService: S3FileService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private resourceHelper: ResourceHelper,
    private readonly visibilityService: VisibilityService,
    @Inject(forwardRef(() => WondersService))
    private readonly wondersService: WondersService,
    private readonly resourcesTypeService: ResourceTypesService,
    private readonly resourcesService: ResourcesService,
  ) { }

  async save(
    createUserSavedResourceDto: CreateUserSavedUserResourceDto,
  ): Promise<any | undefined> {
    const resource: Resource = await this.resourcesService.findOne(
      createUserSavedResourceDto.resourceId,
      null,
      false,
    );
    if (!resource) throw new BadRequestException('Resource not found');

    const publicVisibility: Visibility = await this.visibilityService.getPublicVisibility();

    if (resource.userId === createUserSavedResourceDto.userId)
      throw new BadRequestException('User owns this resource already');

    if (resource.visibilityId !== publicVisibility.id)
      throw new BadRequestException('This is not a public resource to save!');

    let savedResource = null;
    savedResource = await this.resourceRepository.findOne({
      where: {
        userId: createUserSavedResourceDto.userId,
        originalResourceId: createUserSavedResourceDto.resourceId, //check if user already has copy of it
      },
    });

    if (!savedResource) {
      resource.id = null;
      resource.userId = createUserSavedResourceDto.userId;
      resource.isSaved = true;
      resource.originalResourceId = createUserSavedResourceDto.resourceId;
      savedResource = await this.resourceRepository.save(resource);
      return savedResource;
    }

    return savedResource;
  }
}
