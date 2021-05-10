/* eslint-disable prettier/prettier */
import { Controller, Get, Request, Put, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import {
  UserAuthFind,
  UserAuthUpdate,
} from '../../core/decorators/auth.decorator';
import { ProfileUpdateDto } from '../models/dto/profiile-update.dto';
import { profleImageUploadInterceptor } from '../../../utils/file-upload';


@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @UserAuthFind()
  @Get()
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UserAuthUpdate()
  @UseInterceptors(profleImageUploadInterceptor)
  @Put()
  updateProfile(@Body() profileUpdateDto: ProfileUpdateDto, @Request() req, @UploadedFile() file){
    return this.usersService.update(req.user.id, profileUpdateDto)
  }
}
