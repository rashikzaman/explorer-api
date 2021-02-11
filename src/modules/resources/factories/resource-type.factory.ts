import { define } from 'typeorm-seeding';
import { ResourceType } from '../models/entities/resource-type.entity';

define(ResourceType, (faker: any, context: { type: string }) => {
  const visibility = new ResourceType();
  visibility.type = context.type;
  return visibility;
});
