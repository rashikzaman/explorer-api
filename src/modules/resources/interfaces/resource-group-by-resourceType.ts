import { ResourceType } from '../models/entities/resource-type.entity';
import { Resource } from '../models/entities/resource.entity';

export interface ResourceGroupByResourceType {
  id: number;
  type: string;
  resources: Array<Resource>;
}