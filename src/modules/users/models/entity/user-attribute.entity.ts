import { Exclude } from 'class-transformer';
import { Visibility } from '../../../visibility/models/entity/visibility.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  twitterUserName: string;

  @Column({ nullable: true })
  instagramUserName: string;

  @Column({ nullable: true })
  profileImage: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Visibility)
  visibility: Visibility;

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
