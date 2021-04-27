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
  OneToOne,
} from 'typeorm';

import { User } from '../../../users/models/entity/user.entity';
import { ResourceType } from './resource-type.entity';
import { Wonder } from '../../../wonders/models/entities/wonder.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 255 })
  @Index({ fulltext: true })
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

  @Column()
  visibilityId: number;

  @ManyToOne(() => ResourceType)
  @JoinColumn()
  resourceType: ResourceType;

  @Column()
  resourceTypeId: number;

  @Column()
  wonderId: number;

  @ManyToOne(() => Wonder, (wonder) => wonder.resources)
  wonder: Wonder;

  @Column({ type: 'varchar', length: 200, nullable: true })
  urlImage: string;

  @Column({ type: 'text', nullable: true })
  @Index({ fulltext: true })
  keywords: string;

  @Column({ default: false })
  isSpecial: boolean;

  @Column({ default: false })
  isSaved: boolean;

  @OneToOne(() => Resource)
  @JoinColumn()
  originalResource: Resource;

  @Column()
  originalResourceId: number;

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
