import { Resource } from '../../../resources/models/entities/resource.entity';
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
import { Wonder } from '../../../wonders/models/entities/wonder.entity';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @OneToOne(() => Resource)
  resource: Resource;

  @Column()
  resourceId: number;

  @OneToOne(() => Wonder)
  wonder: Wonder;

  @Column()
  wonderId: number;

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
