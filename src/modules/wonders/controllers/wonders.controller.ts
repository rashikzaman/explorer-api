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
    createWonderDto.userId = req.user.userId;
    createWonderDto.coverPhoto = coverPhotoUrl;
    return this.wondersService.create(createWonderDto);
  }

  @Get()
  @UserAuthFindAll()
  findAll(@Request() req) {
    return this.wondersService.findAll(req.user.userId);
  }

  @Get(':id')
  @UserAuthFind()
  findOne(@Param('id') id: string, @Request() req) {
    return this.wondersService.findOne(+id, req.user.userId);
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
    updateWonderDto.userId = req.user.userId;
    return this.wondersService.update(+id, updateWonderDto);
  }

  @Delete(':id')
  @UserAuthDelete()
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const result = await this.wondersService.remove(+id, req.user.userId);
      if (result) return { message: 'Wonder deleted', status: 'success' };
    } catch (e) {
      return { message: "Can't delete Wonder", status: 'error' };
    }
  }
}
