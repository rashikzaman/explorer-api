import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty({ type: String, description: 'email' })
  email: string;
}
