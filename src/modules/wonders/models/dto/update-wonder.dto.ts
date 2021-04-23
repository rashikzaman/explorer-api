import { PartialType } from '@nestjs/swagger';
import { CreateWonderDto } from './create-wonder.dto';

export class UpdateWonderDto extends PartialType(CreateWonderDto) {}
