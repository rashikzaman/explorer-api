import { Resource } from '../../resources/models/entities/resource.entity';

export interface CommonWonderWithResourceInterface {
  title: string;
  coverPhotoUrl: string;
  resources: Array<Resource>;
  resourcesCount: number;
}
