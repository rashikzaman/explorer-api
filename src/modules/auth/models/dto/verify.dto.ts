import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
  @ApiProperty({ type: String, description: 'email' })
  email: string;
  @ApiProperty({ type: String, description: 'Verification Code' })
  verificationCode: string;
}
