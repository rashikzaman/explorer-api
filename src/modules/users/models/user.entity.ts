import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isVerified: boolean;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ select: false })
  @Exclude()
  verificationCode: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
