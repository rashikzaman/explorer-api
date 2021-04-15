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
  ManyToOne,
} from 'typeorm';
import { UserAttribute } from './user-attribute.entity';
import { Field } from 'mysql2';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @ManyToOne(() => Visibility)
  visibility: Visibility;

  @Column()
  visibilityId: string;

  @OneToOne(() => UserAttribute, (userAttribute) => userAttribute.user)
  userAttribute: UserAttribute;

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

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
