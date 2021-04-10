import { ApiProperty } from '@nestjs/swagger';

export class CreateWonderDto {
  @ApiProperty({ type: String, description: 'Wonder title' })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Wonder description',
    required: false,
  })
  description: string;

  @ApiProperty({ type: String, description: 'Cover photo', required: false })
  coverPhoto: string;

  @ApiProperty({
    type: Number,
    description: 'User id',
    required: true,
  })
  userId: number;
}
