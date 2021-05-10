import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Invite } from '../../invite/models/entity/invite.entity';
import { Wonder } from './entities/wonder.entity';

@Injectable()
export class WonderQuery {
  queryBuilder: SelectQueryBuilder<Wonder>;
  randomNumber: number;

  constructor(
    @InjectRepository(Wonder)
    private wonderRepository: Repository<Wonder>,
  ) {}

  setQueryBuilder(): this {
    this.queryBuilder = this.wonderRepository.createQueryBuilder('wonder');
    return this;
  }

  getQueryBuilder(): SelectQueryBuilder<Wonder> {
    return this.queryBuilder;
  }

  setWonderId(id: number): this {
    this.queryBuilder = this.queryBuilder.andWhere('wonder.id =:id', {
      id: id,
    });
    return this;
  }

  setUserId(userId: number): this {
    this.queryBuilder = this.queryBuilder.andWhere('wonder.userId =:userId', {
      userId: userId,
    });
    return this;
  }

  setRelations(): this {
    this.queryBuilder = this.queryBuilder
      .leftJoinAndSelect('wonder.resources', 'resources')
      .loadRelationCountAndMap('wonder.resourcesCount', 'wonder.resources');
    return this;
  }

  setPublicVisibility(publicVisibilityId: number): this {
    this.queryBuilder = this.queryBuilder.andWhere(
      'wonder.visibilityId =:visibilityId',
      {
        visibilityId: publicVisibilityId, //or check if this is a public wonder
      },
    );
    return this;
  }

  setPublicPrivateVisibility(
    wonderId: number,
    userId: number,
    publicVisibilityId,
  ): this {
    if (wonderId) {
      this.queryBuilder = this.queryBuilder.leftJoin(
        Invite,
        'invites',
        'invites.wonderId =:wonderId',
        {
          wonderId: wonderId, //join invite table
        },
      );
    } else {
      this.queryBuilder = this.queryBuilder.leftJoin(
        'wonder.invites',
        'invites',
      );
    }

    this.queryBuilder = this.queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where('invites.inviteeId =:inviteeId', {
          inviteeId: userId, //check if user has invitation for this wonder
        })
          .orWhere('wonder.visibilityId =:visibilityId', {
            visibilityId: publicVisibilityId, //or check if this is a public wonder
          })
          .orWhere('wonder.userId = :userId', {
            userId: userId, //or check if user owns this wonder
          });
      }),
    );
    return this;
  }

  setSearchTerm(searchTerm: string): this {
    this.queryBuilder = this.queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where(
          'MATCH(wonder.title) AGAINST (:searchTerm IN NATURAL LANGUAGE MODE)',
          { searchTerm: searchTerm },
        );
      }),
    );
    return this;
  }

  setParam(paramName, paramValue): this {
    this.queryBuilder = this.queryBuilder.andWhere(
      `wonder.${paramName} =:paramValue`,
      { paramValue: paramValue },
    );
    return this;
  }

  setGroupBy(term: string): this {
    this.queryBuilder = this.queryBuilder.groupBy(`wonder.${term}`);
    return this;
  }

  setOrderBy(term: string, direction: 'ASC' | 'DESC'): this {
    this.queryBuilder = this.queryBuilder.orderBy(`wonder.${term}`, direction);
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

  async findOne(): Promise<Wonder> {
    const wonder = await this.queryBuilder.getOne();
    return wonder;
  }

  async findMany(): Promise<Array<Wonder>> {
    const wonders = await this.queryBuilder.getMany();
    return wonders;
  }
}
