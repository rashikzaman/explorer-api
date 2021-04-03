import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';
import { binary } from 'joi';

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
    type: Number,
    description: 'Wonder Id',
    required: false,
  })
  wonderId: number;

  @ApiProperty({
    type: String,
    description: 'Image file',
    required: false,
    format: 'binary',
  })
  image: Express.Multer.File;

  @ApiProperty({
    type: String,
    description: 'Audio Clip',
    required: false,
    format: 'binary',
  })
  audioClip: Express.Multer.File;

  @ApiProperty({
    type: String,
    description: 'Url Image link',
    required: false,
  })
  urlImage: string;

  @ApiProperty({
    type: Array,
    description: 'Resource Keywords',
    required: false,
  })
  keywords: [string];
}
