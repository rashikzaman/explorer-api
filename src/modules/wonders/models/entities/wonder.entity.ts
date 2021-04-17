import { Resource } from '../../../resources/models/entities/resource.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '../../../users/models/entity/user.entity';
import { Visibility } from '../../../visibility/models/entity/visibility.entity';

@Entity()
export class Wonder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '100' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Visibility)
  @JoinColumn()
  visibility: Visibility;

  @Column()
  visibilityId: number;

  @Column({ type: 'varchar', length: '255' })
  coverPhotoUrl: string;

  @OneToMany(() => Resource, (resource) => resource.wonder)
  resources: Resource[];
  resourcesCount: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
