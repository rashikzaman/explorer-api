import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/models/entity/user.entity';
import { Brackets, In, Repository } from 'typeorm';
import { CreateResourceDto } from '../models/dto/create-resource.dto';
import { UpdateResourceDto } from '../models/dto/update-resource.dto';
import { Resource } from '../models/entities/resource.entity';
import { Visibility } from '../../visibility/models/entity/visibility.entity';
import { ResourceType } from '../models/entities/resource-type.entity';
import { ConfigService } from '@nestjs/config';
import { S3FileService } from '../../aws/s3/services/s3-file.service';
import { Wonder } from '../../wonders/models/entities/wonder.entity';
import { ResourceHelper } from '../helpers/resource-helper';
import { VisibilityService } from '../../visibility/services/visibility.service';
import { WondersService } from '../../wonders/services/wonders.service';
import { ResourceTypesService } from './resource-types.service';
import Pagination from '../../core/interfaces/pagination.interface';
import { PaginationHelper } from '../../core/helpers/pagination-helper';
import { Invite } from 'src/modules/invite/models/entity/invite.entity';

@Injectable()
export class ResourceQueryService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private resourceHelper: ResourceHelper,
    private readonly visibilityService: VisibilityService,
    @Inject(forwardRef(() => WondersService))
    private readonly wondersService: WondersService,
    private readonly resourcesTypeService: ResourceTypesService,
    private readonly paginationHelper: PaginationHelper,
  ) {}
}
