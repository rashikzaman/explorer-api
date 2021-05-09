import { Resource } from '../../../resources/models/entities/resource.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '../../../users/models/entity/user.entity';
import { Visibility } from '../../../visibility/models/entity/visibility.entity';
import { Invite } from 'src/modules/invite/models/entity/invite.entity';

@Entity()
export class Wonder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '100' })
  @Index({ fulltext: true })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Visibility)
  @JoinColumn()
  visibility: Visibility;

  @Column()
  visibilityId: number;

  @Column({ type: 'varchar', length: '255' })
  coverPhotoUrl: string;

  @OneToMany(() => Resource, (resource) => resource.wonder)
  resources: Resource[];
  resourcesCount: number;

  @OneToMany(() => Invite, (invite) => invite.wonder)
  invites: Invite[];

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
