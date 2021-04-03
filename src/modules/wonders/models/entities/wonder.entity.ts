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

  @Column({ type: 'varchar', length: '255' })
  coverPhotoUrl: string;

  @ManyToOne(() => Visibility)
  @JoinColumn()
  visibility: Visibility;

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
