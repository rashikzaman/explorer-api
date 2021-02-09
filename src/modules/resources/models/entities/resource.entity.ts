import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../../users/models/user.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  url: string;

  @Column()
  audio_clip_link: string;
}
