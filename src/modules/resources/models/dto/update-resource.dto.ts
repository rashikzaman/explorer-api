import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @ApiProperty({
    type: String,
    description: 'Image file',
    required: false,
  })
  imageLink: string;

  @ApiProperty({
    type: String,
    description: 'Audio Clip',
    required: false,
  })
  audioClipLink: string;
}
