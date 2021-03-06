import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetTokenRequestDto {
  @ApiProperty({ type: String, description: 'email' })
  email: string;
}
