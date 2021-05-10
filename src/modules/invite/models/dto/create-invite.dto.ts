import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';
import { binary } from 'joi';

export class CreateInviteDto {
  @ApiProperty({ type: Number, description: 'Host id', required: true })
  hostId: number;

  @ApiProperty({ type: Number, description: 'Invitee id', required: true })
  inviteeId: number;

  @ApiProperty({
    type: Number,
    description: 'Resource id',
    required: false,
  })
  resourceId: number;

  @ApiProperty({
    type: Number,
    description: 'Wonder Id',
    required: false,
  })
  wonderId: number;
}
