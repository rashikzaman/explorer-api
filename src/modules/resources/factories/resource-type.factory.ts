import { define } from 'typeorm-seeding';
import { ResourceType } from '../models/entities/resource-type.entity';

define(ResourceType, (faker: any, context: { type: string }) => {
  const resource = new ResourceType();
  resource.type = context.type;
  return resource;
});
