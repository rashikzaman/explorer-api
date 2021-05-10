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
import { Resource } from '../../resources/models/entities/resource.entity';
import { CommonWonderWithResourceInterface } from '../interfaces/common-wonder-with-resource.interface';
import Pagination from 'src/modules/core/interfaces/pagination.interface';
import { PaginationHelper } from '../../core/helpers/pagination-helper';
import { WonderQuery } from '../models/wonder-query';
import { Visibility } from '../../visibility/models/entity/visibility.entity';

@Injectable()
export class WondersService {
  private defaultWonderTitle;
  private wonderQuery: WonderQuery;
  constructor(
    @InjectRepository(Wonder)
    private readonly wonderRepository: Repository<Wonder>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => ResourcesService))
    private readonly resourceService: ResourcesService,
    private readonly resourceHelper: ResourceHelper,
    private readonly configService: ConfigService,
    private readonly visibilityService: VisibilityService,
    private readonly paginationHelper: PaginationHelper,
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
    pagination: Pagination,
    query: {
      userId?: number;
      searchTerm?: string;
      withRelations?: boolean;
      checkPublicPrivateVisibility?: boolean;
    },
  ): Promise<Collection | undefined> {
    const {
      pageSize,
      skippedItems,
      pageNumber,
    } = this.paginationHelper.getPageSizeAndNumber(pagination);

    const {
      userId,
      searchTerm,
      withRelations = true,
      checkPublicPrivateVisibility = false,
    } = query;

    let sqlBuilder = this.getSqlBuilder();

    const user = await this.getUser(userId);

    if (user && !checkPublicPrivateVisibility) {
      sqlBuilder = sqlBuilder.setUserId(userId);
    } else if (user && checkPublicPrivateVisibility) {
      const publicVisibility: Visibility = await this.visibilityService.getPublicVisibility();
      sqlBuilder = sqlBuilder.setPublicPrivateVisibility(
        null,
        userId,
        publicVisibility.id,
      );
    } else if (!user) {
      const publicVisibility: Visibility = await this.visibilityService.getPublicVisibility();
      sqlBuilder = sqlBuilder.setPublicVisibility(publicVisibility.id);
    }

    if (withRelations) {
      sqlBuilder = sqlBuilder.setRelations();
    }

    if (searchTerm) {
      sqlBuilder = sqlBuilder.setSearchTerm(searchTerm);
    }

    const totalCount = await sqlBuilder.getQueryBuilder().getCount();

    if (pageSize) sqlBuilder = sqlBuilder.setTake(pageSize);
    if (skippedItems) sqlBuilder = sqlBuilder.setSkip(skippedItems);

    const wonders = await sqlBuilder.findMany();
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
    query: {
      userId?: number;
      withRelations?: boolean;
      checkPublicPrivateVisibility?: boolean;
    },
  ): Promise<Wonder | undefined> {
    const {
      userId,
      withRelations = true,
      checkPublicPrivateVisibility = false,
    } = query;

    const user = await this.getUser(userId);

    let sqlBuilder = this.getSqlBuilder();
    sqlBuilder = sqlBuilder.setWonderId(id);
    if (user) sqlBuilder = sqlBuilder.setUserId(userId);
    if (withRelations) sqlBuilder = sqlBuilder.setRelations();

    const wonder = await sqlBuilder.findOne();
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
    const wonder = await this.findOne(id, { userId: updateWonderDto.userId });

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

  async remove(id: number, userId: number): Promise<any> {
    await this.findOne(id, { userId: userId });
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

  async getAllCommonWonders(
    userId: number = null,
    pagination: Pagination,
  ): Promise<Collection | undefined> {
    const {
      pageSize,
      skippedItems,
      pageNumber,
    } = this.paginationHelper.getPageSizeAndNumber(pagination);

    const publicVisibility = await this.visibilityService.getPublicVisibility();

    let sqlBuilder = this.getSqlBuilder();
    sqlBuilder = sqlBuilder.setGroupBy('title').setOrderBy('title', 'ASC');

    if (!userId)
      sqlBuilder = sqlBuilder.setPublicVisibility(publicVisibility.id);
    else
      sqlBuilder = sqlBuilder.setPublicPrivateVisibility(
        null,
        userId,
        publicVisibility.id,
      );

    const wonders = await sqlBuilder
      .setTake(pageSize)
      .setSkip(skippedItems)
      .findMany();

    //https://github.com/typeorm/typeorm/issues/544
    const totalRows = await sqlBuilder
      .getQueryBuilder()
      .select('COUNT(wonder.title) AS cnt')
      .getRawMany();

    const totalCount = totalRows.length;

    const data: Array<CommonWonderWithResourceInterface> = [];
    await Promise.all(
      wonders.map(async (wonder) => {
        const wonders = await this.wonderRepository.find({
          title: wonder.title,
        });
        const wonderIds = wonders.map((item) => item.id);
        const resourcesData = await this.resourceService.findAll(pagination, {
          wonderIds: wonderIds,
          checkPublicPrivateVisibility: true,
          userId: userId,
        });

        const resources = resourcesData.items;

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

  async getCommonWonderWithResources(
    title: string,
    userId: number = null,
  ): Promise<CommonWonderWithResourceInterface> {
    const wonders = await this.getCommonWondersWithTitle(title, userId);
    const wonderIds = wonders.map((item) => item.id);
    const resources = await this.resourceService.findAll(
      { pageNumber: null, pageSize: null },
      {
        wonderIds: wonderIds,
        checkPublicPrivateVisibility: true,
        withRelation: true,
        userId: userId,
      },
    );
    const data: CommonWonderWithResourceInterface = {
      title: title,
      resources: resources.items,
      resourcesCount: resources.items.length,
    };

    return data;
  }

  async getCommonWondersWithTitle(
    title,
    userId: number = null,
  ): Promise<Array<Wonder>> {
    const publicVisibility = await this.visibilityService.getPublicVisibility();

    let sqlBuilder = this.getSqlBuilder();
    sqlBuilder = sqlBuilder.setParam('title', title);

    if (!userId)
      sqlBuilder = sqlBuilder.setPublicVisibility(publicVisibility.id);
    else
      sqlBuilder = sqlBuilder.setPublicPrivateVisibility(
        null,
        userId,
        publicVisibility.id,
      );

    const wonders = await sqlBuilder.findMany();
    return wonders;
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

  getSqlBuilder() {
    const wonderQuery = new WonderQuery(this.wonderRepository);
    return wonderQuery.setQueryBuilder();
  }
}
