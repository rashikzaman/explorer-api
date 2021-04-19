import { Exclude } from 'class-transformer';
import { Visibility } from '../../../visibility/models/entity/visibility.entity';
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
import { Resource } from '../../../resources/models/entities/resource.entity';

@Entity()
export class CommonWonderWithResource {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  wonderTitle: string;

  @OneToOne(() => Resource)
  @JoinColumn()
  resource: Resource;

  resources: Array<Resource>;

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
