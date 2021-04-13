import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourcesService } from '../../resources/services/resources.service';
import { ConfigService } from '@nestjs/config';
import { CommonWonderWithResource } from '../models/entities/common-wonder-with-resource.entity';
import { WondersService } from './wonders.service';
import { Wonder } from '../models/entities/wonder.entity';
import { json } from 'express';
import { VisibilityService } from '../../visibility/services/visibility.service';

@Injectable()
export class CommonWonderResourceService {
  constructor(
    @InjectRepository(CommonWonderWithResource)
    private commonWonderWithResourceRepository: Repository<CommonWonderWithResource>,
    @InjectRepository(Wonder)
    private wonderRepository: Repository<Wonder>,
    private wondersService: WondersService,
    private resourceService: ResourcesService,
    private configService: ConfigService,
    private visibilityService: VisibilityService,
  ) {}

  async loadCommonWonders() {
    const commonWondersWithResources = await this.getAllWonders();
    await Promise.all(
      Object.keys(commonWondersWithResources).map(async (key) => {
        await Promise.all(
          commonWondersWithResources[key].map(async (item) => {
            const wonder = await this.getWonderWithResource(key, item);
            if (!wonder) {
              await this.commonWonderWithResourceRepository
                .createQueryBuilder()
                .insert()
                .into(CommonWonderWithResource)
                .values({
                  wonderTitle: key,
                  resource: item,
                })
                .execute();
            }
          }),
        );
      }),
    );
  }

  async getAllWonders() {
    const publicVisibility = await this.visibilityService.getPublicVisibility();
    let commonWonderWithResources = {};

    const wonders = await this.wonderRepository
      .createQueryBuilder('wonder')
      .leftJoinAndSelect('wonder.resources', 'resources')
      .where('resources.visibilityId = :visibilityId', {
        visibilityId: publicVisibility.id,
      })
      .getMany();

    wonders.forEach((wonder) => {
      wonder.resources.forEach((resource) => {
        if (commonWonderWithResources[wonder.title]) {
          commonWonderWithResources = {
            ...commonWonderWithResources,
            [wonder.title]: [
              ...commonWonderWithResources[wonder.title],
              resource.id,
            ],
          };
        } else {
          commonWonderWithResources = {
            ...commonWonderWithResources,
            [wonder.title]: [resource.id],
          };
        }
      });
    });
    return commonWonderWithResources;
  }

  async getWonderWithResource(
    wonderTitle: string,
    resourceId: number,
  ): Promise<CommonWonderWithResource | undefined> {
    const wonderResource = await this.commonWonderWithResourceRepository
      .createQueryBuilder('commonWonderWithResource')
      .where('commonWonderWithResource.wonderTitle = :title', {
        title: wonderTitle,
      })
      .andWhere('commonWonderWithResource.resourceId = :resourceId', {
        resourceId: resourceId,
      })
      .getOne();
    return wonderResource;
  }
}
