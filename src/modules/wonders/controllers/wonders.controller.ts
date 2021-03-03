import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UsePipes,
  Request,
  UploadedFile,
} from '@nestjs/common';
import { WondersService } from '../services/wonders.service';
import { CreateWonderDto } from '../models/dto/create-wonder.dto';
import { UpdateWonderDto } from '../models/dto/update-wonder.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { wonderCoverPhotoUploadInterceptor } from 'src/utils/file-upload';
import { JoiValidationPipe } from '../../../validation.pipe';
import { createWonderSchema } from '../validation-schemas/schemas';

@Controller('wonders')
export class WondersController {
  constructor(private readonly wondersService: WondersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiCreatedResponse()
  @UseInterceptors(wonderCoverPhotoUploadInterceptor)
  @UsePipes(new JoiValidationPipe(createWonderSchema))
  create(
    @Body() createWonderDto: CreateWonderDto,
    @Request() req,
    @UploadedFile() file,
  ) {
    const coverPhotoUrl = file ? file.path.replace(/\\/g, '/') : null;
    createWonderDto.userId = req.user.userId;
    createWonderDto.coverPhoto = coverPhotoUrl;
    return this.wondersService.create(createWonderDto);
  }

  @Get()
  findAll() {
    return this.wondersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wondersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateWonderDto: UpdateWonderDto) {
    return this.wondersService.update(+id, updateWonderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wondersService.remove(+id);
  }
}
