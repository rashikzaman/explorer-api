import { Resource } from '../../resources/models/entities/resource.entity';
import { Wonder } from '../../wonders/models/entities/wonder.entity';

export interface SearchCollection {
  resources: Array<Resource>;
  wonders: Array<Wonder>;
}
