import { Resource } from '../../resources/models/entities/resource.entity';

export interface CommonWonderWithResourceInterface {
  title: string;
  resources: Array<Resource>;
  resourcesCount: number;
}
