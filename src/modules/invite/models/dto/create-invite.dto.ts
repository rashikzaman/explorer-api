import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';
import { binary } from 'joi';

export class CreateInviteDto {
  @ApiProperty({ type: Number, description: 'User id', required: false })
  userId: number;

  @ApiProperty({
    type: Number,
    description: 'Resource id',
    required: true,
  })
  resourceId: number;

  @ApiProperty({
    type: Number,
    description: 'Wonder Id',
    required: false,
  })
  wonderId: number;
}
