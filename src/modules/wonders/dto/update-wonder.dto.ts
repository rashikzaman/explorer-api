import { PartialType } from '@nestjs/mapped-types';
import { CreateWonderDto } from './create-wonder.dto';

export class UpdateWonderDto extends PartialType(CreateWonderDto) {}
