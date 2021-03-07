import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetTokenDto {
  @ApiProperty({ type: String, description: 'email' })
  email: string;
  @ApiProperty({ type: String, description: 'token' })
  token: string;
  @ApiProperty({ type: String, description: 'password' })
  password: string;
}
