import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWonderDto } from './create-wonder.dto';

export class UpdateWonderDto extends PartialType(CreateWonderDto) {
  @ApiProperty({
    type: Number,
    description: 'Visibility type id',
    required: true,
  })
  visibilityTypeId: number;
}
