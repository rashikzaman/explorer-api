import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  Request,
  UsePipes,
  UploadedFiles,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { JoiValidationPipe } from '../../../validation.pipe';
import { createInviteSchema } from '../validation-schemas/schemas';
import {
  UserAuthCreate,
  UserAuthDelete,
  UserAuthFind,
  UserAuthUpdate,
  UserAuthFindAll,
} from '../../core/decorators/auth.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { CreateInviteDto } from '../models/dto/create-invite.dto';
import { InviteService } from '../services/invite.service';

@Controller('invites')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post()
  @UserAuthCreate()
  @UsePipes(new JoiValidationPipe(createInviteSchema))
  async create(@Body() createInviteDto: CreateInviteDto, @Request() req) {
    createInviteDto.hostId = req.user.userId;
    const result = await this.inviteService.create(createInviteDto);
    return result;
  }

  @Delete(':id')
  @UserAuthDelete()
  async delete(@Param('id') id: number, @Request() req) {
    const result = await this.inviteService.delete(+id, req.user.userId);
    return result;
  }
}
