import { define } from 'typeorm-seeding';
import { Visibility } from '../models/entity/visibility.entity';

define(Visibility, (faker: any, context: { type: string }) => {
  const visibility = new Visibility();
  visibility.type = context.type;
  return visibility;
});
