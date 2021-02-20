import { BasicEntity } from 'src/modules/core/models/entities/basic.entity';
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
import { User } from '../../users/models/user.entity';

export class Wonder extends BasicEntity {
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  coverImageLink: string;
}
