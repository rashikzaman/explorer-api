import { Exclude } from 'class-transformer';
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
export class Resource {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  url: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  audio_clip_link: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  image_link: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: string;
}
