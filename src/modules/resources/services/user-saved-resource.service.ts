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
import { UserSavedResource } from '../models/entities/user-saved-resource.entity';
import { DeleteUserSavedUserResourceDto } from '../models/dto/delete-user-saved-resource.dto';

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
    @InjectRepository(UserSavedResource)
    private readonly userSavedResourceRepository: Repository<UserSavedResource>,
  ) {}

  async save(
    createUserSavedResourceDto: CreateUserSavedUserResourceDto,
  ): Promise<UserSavedResource | undefined> {
    const resource = await this.resourceRepository.findOne(
      createUserSavedResourceDto.resourceId,
      {
        relations: ['user'],
      },
    );
    if (!resource) throw new NotFoundException('Resource not found!');
    const publicVisibility = await this.visibilityService.getPublicVisibility();

    if (resource.userId === createUserSavedResourceDto.userId)
      throw new BadRequestException('This resource belongs to you!');

    if (resource.visibilityId === publicVisibility.id) {
      let savedResource = null;
      savedResource = await this.userSavedResourceRepository.findOne({
        userId: createUserSavedResourceDto.userId,
        resourceId: createUserSavedResourceDto.resourceId,
      });

      if (savedResource) return savedResource;

      savedResource = await this.userSavedResourceRepository.save({
        userId: createUserSavedResourceDto.userId,
        resourceId: createUserSavedResourceDto.resourceId,
      });

      return savedResource;
    } else {
      throw new BadRequestException('This resource is not public');
    }
  }

  async unsave(
    deleteUserSavedResourceDto: DeleteUserSavedUserResourceDto,
  ): Promise<boolean> {
    await this.userSavedResourceRepository.delete({
      userId: deleteUserSavedResourceDto.userId,
      resourceId: deleteUserSavedResourceDto.resourceId,
    });
    return true;
  }
}
