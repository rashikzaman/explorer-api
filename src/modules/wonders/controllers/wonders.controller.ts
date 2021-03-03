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
  HttpCode,
} from '@nestjs/common';
import { WondersService } from '../services/wonders.service';
import { CreateWonderDto } from '../models/dto/create-wonder.dto';
import { UpdateWonderDto } from '../models/dto/update-wonder.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  findAll(@Request() req) {
    return this.wondersService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  findOne(@Param('id') id: string, @Request() req) {
    return this.wondersService.findOne(+id, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateWonderDto: UpdateWonderDto) {
    return this.wondersService.update(+id, updateWonderDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  remove(@Param('id') id: string, @Request() req) {
    const result = this.wondersService.remove(+id, req.user.userId);
    if (result) return { message: 'Resource deleted', status: 'success' };
    else return { message: "Can't delete the resource", status: 'failure' };
  }
}
