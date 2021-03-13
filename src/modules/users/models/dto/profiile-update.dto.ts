import { ApiProperty } from '@nestjs/swagger';

export class ProfileUpdateDto {
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @ApiProperty({ type: String, description: 'username' })
  username: string;

  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @ApiProperty({ type: String, description: 'oldPassword' })
  oldPassword: string;

  @ApiProperty({ type: String, description: 'newPassword' })
  newPassword: string;

  @ApiProperty({ type: Number, description: 'visibilityId' })
  visibilityId: number;

  @ApiProperty({
    type: String,
    description: 'confirmNewPassword',
    required: false,
  })
  confirmNewPassword: string;

  @ApiProperty({
    type: String,
    description: 'instagramUserName',
    required: false,
  })
  instagramUserName: string;

  @ApiProperty({
    type: String,
    description: 'twitterUserName',
    required: false,
  })
  twitterUserName: string;
}
