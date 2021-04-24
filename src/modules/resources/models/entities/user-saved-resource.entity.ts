import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { User } from '../../../users/models/entity/user.entity';
import { Resource } from './resource.entity';

@Entity()
export class UserSavedResource {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @OneToOne(() => Resource)
  @JoinColumn()
  resource: Resource;

  @Column()
  resourceId: number;

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
