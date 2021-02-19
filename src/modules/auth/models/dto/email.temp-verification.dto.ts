import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationDto {
  @ApiProperty({ type: String, description: 'email' })
  email: string;
  @ApiProperty({ type: String, description: 'verificationCode' })
  password: string;
}
