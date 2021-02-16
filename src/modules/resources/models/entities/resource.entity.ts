import { Exclude } from 'class-transformer';
import { Visibility } from '../../../visibility/models/entity/visibility.entity';
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
} from 'typeorm';

import { User } from '../../../users/models/user.entity';
import { ResourceType } from './resource-type.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  url: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  audioClipLink: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  imageLink: string;

  @ManyToOne(() => Visibility)
  @JoinColumn()
  visibility: Visibility;

  @ManyToOne(() => ResourceType)
  @JoinColumn()
  resourceType: ResourceType;

  // @JoinColumn({ name: 'id' })
  // visibilityId: Visibility;

  // @JoinColumn({ name: 'id' })
  // resourceTypeId: ResourceType;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}