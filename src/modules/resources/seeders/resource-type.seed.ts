import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { ResourceType } from '../models/entities/resource-type.entity';

export default class CreateResourceType implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(ResourceType)({ type: 'movie' }).create();
    await factory(ResourceType)({ type: 'music' }).create();
    await factory(ResourceType)({ type: 'video' }).create();
    await factory(ResourceType)({ type: 'article' }).create();
    await factory(ResourceType)({ type: 'game' }).create();
  }
}
