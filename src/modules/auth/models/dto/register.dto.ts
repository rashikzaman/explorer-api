import { ApiProperty } from '@nestjs/swagger';
import { string } from 'joi';

export class RegisterDto {
  @ApiProperty({ type: String, description: 'email' })
  email: string;
  @ApiProperty({ type: String, description: 'password' })
  password: string;
  @ApiProperty({ type: String, description: 'confirmPassword' })
  confirmPassword: string;
  @ApiProperty({ type: String, description: 'firstname', required: false })
  firstName: string;
  @ApiProperty({ type: String, description: 'lastname', required: false })
  lastName: string;
}
