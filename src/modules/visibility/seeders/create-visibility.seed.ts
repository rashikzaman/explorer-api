import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Visibility } from '../models/entity/visibility.entity';

export default class CreateVisibility implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    try {
      await factory(Visibility)({ type: 'public' }).create();
      await factory(Visibility)({ type: 'private' }).create();
      await factory(Visibility)({ type: 'invite_only' }).create();
    } catch (e) {}
  }
}
