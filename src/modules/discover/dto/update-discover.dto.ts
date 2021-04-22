import { PartialType } from '@nestjs/swagger';
import { CreateDiscoverDto } from './create-discover.dto';

export class UpdateDiscoverDto extends PartialType(CreateDiscoverDto) {}
