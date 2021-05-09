import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Resource } from '../models/entities/resource.entity';
import { Invite } from '../../invite/models/entity/invite.entity';

@Injectable()
export class ResourceQuery {
  queryBuilder: SelectQueryBuilder<Resource>;
  randomNumber: number;

  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  setQueryBuilder(): this {
    this.queryBuilder = this.resourceRepository.createQueryBuilder('resource');
    return this;
  }

  getQueryBuilder(): SelectQueryBuilder<Resource> {
    return this.queryBuilder;
  }

  setResourceId(id: number): this {
    this.queryBuilder = this.queryBuilder.andWhere('resource.id =:id', {
      id: id,
    });
    return this;
  }

  setUserId(userId: number): this {
    this.queryBuilder = this.queryBuilder.andWhere('resource.userId =:userId', {
      userId: userId,
    });
    return this;
  }

  setWonderId(wonderId: number) {
    this.queryBuilder = this.queryBuilder.andWhere(
      'resource.wonderId =:wonderId',
      {
        wonderId: wonderId,
      },
    );
    return this;
  }

  setWonderIds(wonderIds: Array<number>): this {
    this.queryBuilder = this.queryBuilder.andWhere(
      'resource.wonderId In (:...wonderIds)',
      {
        wonderIds: [null, ...wonderIds], //https://github.com/typeorm/typeorm/issues/2195
      },
    );
    return this;
  }

  setResourceTypeId(resourceTypeId: number): this {
    this.queryBuilder = this.queryBuilder.andWhere(
      'resource.resourceTypeId =:resourceTypeId',
      {
        resourceTypeId: resourceTypeId,
      },
    );
    return this;
  }

  setRelations(): this {
    this.queryBuilder = this.queryBuilder
      .leftJoinAndSelect('resource.resourceType', 'resourceType')
      .leftJoinAndSelect('resource.visibility', 'visibility')
      .leftJoinAndSelect('resource.wonder', 'wonder');
    return this;
  }

  setClonedResourceCount(): this {
    this.queryBuilder = this.queryBuilder.loadRelationCountAndMap(
      'resource.clonedResourcesCount',
      'resource.clonedResources',
    );
    return this;
  }

  setPublicVisibility(publicVisibilityId: number): this {
    this.queryBuilder = this.queryBuilder.andWhere(
      'resource.visibilityId =:visibilityId',
      {
        visibilityId: publicVisibilityId, //or check if this is a public resource
      },
    );
    return this;
  }

  setPublicPrivateVisibility(
    resourceId: number,
    userId: number,
    publicVisibilityId,
  ): this {
    if (resourceId) {
      this.queryBuilder = this.queryBuilder.leftJoin(
        Invite,
        'invites',
        'invites.resourceId =:resourceId',
        {
          resourceId: resourceId, //join invite table
        },
      );
    } else {
      this.queryBuilder = this.queryBuilder.leftJoin(
        'resource.invites',
        'invites',
      );
    }

    this.queryBuilder = this.queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where('invites.inviteeId =:inviteeId', {
          inviteeId: userId, //check if user has invitation for this resource
        })
          .orWhere('resource.visibilityId =:visibilityId', {
            visibilityId: publicVisibilityId, //or check if this is a public resource
          })
          .orWhere('resource.userId = :userId', {
            userId: userId, //or check if user owns this resource
          });
      }),
    );
    return this;
  }

  setSearchTerm(searchTerm: string): this {
    this.queryBuilder = this.queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where(
          'MATCH(resource.title) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)',
          { searchTerm: searchTerm },
        ).orWhere(
          'MATCH(resource.keywords) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)',
          { searchTerm: searchTerm },
        );
      }),
    );
    return this;
  }

  setTake(take: number): this {
    this.queryBuilder = this.queryBuilder.take(take);
    return this;
  }

  setSkip(skipNumber: number): this {
    this.queryBuilder = this.queryBuilder.skip(skipNumber);
    return this;
  }

  async findOne(): Promise<Resource> {
    const resource = await this.queryBuilder.getOne();
    return resource;
  }

  async findMany(): Promise<Array<Resource>> {
    const resources = await this.queryBuilder.getMany();
    return resources;
  }
}
