import { Exclude } from 'class-transformer';
import { BasicEntity } from '../../../core/models/entities/basic.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { User } from '../../../users/models/user.entity';

@Entity()
export class Wonder extends BasicEntity {
  @Column({ type: 'varchar', length: '100' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
