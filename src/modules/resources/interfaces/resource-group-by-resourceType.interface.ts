import { ResourceType } from '../models/entities/resource-type.entity';
import { Resource } from '../models/entities/resource.entity';

export interface ResourceGroupByResourceTypeInterface {
  id: number;
  type: string;
  resourcesCount: number;
  resources: Array<Resource>;
}
