import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UsePipes,
  Request,
  UploadedFile,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { WondersService } from '../services/wonders.service';
import { CreateWonderDto } from '../models/dto/create-wonder.dto';
import { UpdateWonderDto } from '../models/dto/update-wonder.dto';
import { wonderCoverPhotoUploadInterceptor } from '../../../utils/file-upload';
import { JoiValidationPipe } from '../../../validation.pipe';
import {
  createWonderSchema,
  updateWonderSchema,
} from '../validation-schemas/schemas';
import {
  UserAuthCreate,
  UserAuthFind,
  UserAuthFindAll,
  UserAuthDelete,
  UserAuthUpdate,
} from '../../core/decorators/auth.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { type } from 'os';
import { number } from 'joi';

@Controller('wonders')
export class WondersController {
  constructor(private readonly wondersService: WondersService) {}

  @Post()
  @UserAuthCreate()
  @UseInterceptors(wonderCoverPhotoUploadInterceptor)
  @UsePipes(new JoiValidationPipe(createWonderSchema))
  create(
    @Body() createWonderDto: CreateWonderDto,
    @Request() req,
    @UploadedFile() file,
  ) {
    const coverPhotoUrl = file ? file.path.replace(/\\/g, '/') : null;
    createWonderDto.userId = req.user.id;
    createWonderDto.coverPhoto = coverPhotoUrl;
    return this.wondersService.create(createWonderDto);
  }

  @Get()
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'pageNumber' })
  @UserAuthFindAll()
  findAll(
    @Request() req,
    @Query()
    query: { pageSize: number; pageNumber: number },
  ) {
    return this.wondersService.findAll(
      {
        pageSize: query.pageSize,
        pageNumber: query.pageNumber,
      },
      {
        userId: req.user.id,
      },
    );
  }

  @Get(':id')
  @UserAuthFind()
  async findOne(@Param('id') id: string, @Request() req) {
    const wonder = await this.wondersService.findOne(+id, {
      userId: req.user.id,
    });
    if (!wonder) throw new NotFoundException('Wonder not found');
    return wonder;
  }

  @Put(':id')
  @UserAuthUpdate()
  @UseInterceptors(wonderCoverPhotoUploadInterceptor)
  @UsePipes(new JoiValidationPipe(updateWonderSchema))
  update(
    @Param('id') id: string,
    @Body() updateWonderDto: UpdateWonderDto,
    @Request() req,
  ) {
    updateWonderDto.userId = req.user.id;
    return this.wondersService.update(+id, updateWonderDto);
  }

  @Delete(':id')
  @UserAuthDelete()
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const result = await this.wondersService.remove(+id, req.user.id);
      if (result) return { message: 'Wonder deleted', status: 'success' };
    } catch (e) {
      return { message: "Can't delete Wonder", status: 'error' };
    }
  }
}
