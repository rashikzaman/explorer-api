import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ResourceType } from './resource-type.entity';

@Entity()
export class WebsiteResourceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  domain: string;

  @ManyToOne(() => ResourceType)
  @JoinColumn()
  resourceType: ResourceType;

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
