import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSavedUserResourceDto {
  @ApiProperty({ type: Number, description: 'User id' })
  userId: number;

  @ApiProperty({ type: Number, description: 'Resource Id' })
  resourceId: number;
}
