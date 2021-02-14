import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({ type: Number, description: 'User id', required: false })
  userId: number;

  @ApiProperty({ type: String, description: 'Resource title' })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Resource description',
    required: false,
  })
  description: string;

  @ApiProperty({ type: String, description: 'Resource url', required: false })
  url: string;

  @ApiProperty({
    type: Number,
    description: 'Resource type id',
    required: true,
  })
  resourceTypeId: number;

  @ApiProperty({
    type: Number,
    description: 'Visibility type id',
    required: true,
  })
  visibilityTypeId: number;

  @ApiProperty({
    type: String,
    description: 'Image file',
    required: false,
  })
  image: string;

  @ApiProperty({
    type: String,
    description: 'Audio Clip',
    required: false,
  })
  audioClip: string;
}
