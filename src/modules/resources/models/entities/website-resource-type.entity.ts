import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class WebsiteResourceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  domain: string;

  @Column()
  resourceType: string;
}
