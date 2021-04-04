import { Exclude } from 'class-transformer';
import { Visibility } from '../../../visibility/models/entity/visibility.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '../../../users/models/entity/user.entity';
import { ResourceType } from './resource-type.entity';
import { ResourceKeyword } from './resource-keyword.entity';
import { Wonder } from '../../../wonders/models/entities/wonder.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  url: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  audioClipLink: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  imageLink: string;

  @ManyToOne(() => Visibility)
  @JoinColumn()
  visibility: Visibility;

  @ManyToOne(() => ResourceType)
  @JoinColumn()
  resourceType: ResourceType;

  @ManyToOne(() => Wonder)
  @JoinColumn()
  wonder: Wonder;

  @OneToMany(
    () => ResourceKeyword,
    (resourceKeyword) => resourceKeyword.resource,
  )
  resourceKeywords: ResourceKeyword;

  @Column({ type: 'varchar', length: 200, nullable: true })
  urlImage: string;

  @Column({ default: false })
  isSpecial: boolean;

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
