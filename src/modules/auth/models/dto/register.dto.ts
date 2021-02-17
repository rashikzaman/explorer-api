import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ type: String, description: 'email' })
  email: string;
  @ApiProperty({ type: String, description: 'password' })
  password: string;
  @ApiProperty({ type: String, description: 'confirmPassword' })
  confirmPassword: string;
  @ApiProperty({ type: String, description: 'username', required: false })
  username: string;
}
