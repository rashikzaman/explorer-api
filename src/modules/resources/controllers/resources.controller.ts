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
  Query,
} from '@nestjs/common';
import { ResourcesService } from '../services/resources.service';
import { CreateResourceDto } from '../models/dto/create-resource.dto';
import { UpdateResourceDto } from '../models/dto/update-resource.dto';
import { getMetadata } from 'page-metadata-parser';
import * as domino from 'domino';
import * as fetch from 'node-fetch';
import { resourceFileUploadInterceptor } from '../../../utils/file-upload';
import { JoiValidationPipe } from '../../../validation.pipe';
import {
  createResourceSchema,
  updateResourceSchema,
} from '../validation-schemas/schemas';
import {
  UserAuthCreate,
  UserAuthDelete,
  UserAuthFind,
  UserAuthUpdate,
  UserAuthFindAll,
} from '../../core/decorators/auth.decorator';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @UserAuthCreate()
  @UseInterceptors(resourceFileUploadInterceptor)
  @UsePipes(new JoiValidationPipe(createResourceSchema))
  create(
    @Body() createResourceDto: CreateResourceDto,
    @UploadedFiles() files,
    @Request() req,
  ) {
    let imagePath = null;
    let audioClipPath = null;
    if (files) {
      imagePath = files.image ? files.image[0].path.replace(/\\/g, '/') : null;
      audioClipPath = files.audioClip
        ? files.audioClip[0].path.replace(/\\/g, '/')
        : null;
    }
    createResourceDto.image = imagePath;
    createResourceDto.audioClip = audioClipPath;
    createResourceDto.userId = req.user.userId;
    const result = this.resourcesService.create(createResourceDto);
    return result;
  }

  @Get()
  @UserAuthFindAll()
  findAll(
    @Request() req,
    @Query() query: { pageSize: number; pageNumber: number },
  ) {
    return this.resourcesService.findAll(req.user.userId, query);
  }

  @Get(':id')
  @UserAuthFind()
  findOne(@Param('id') id: string, @Request() req) {
    return this.resourcesService.findOne(+id, req.user.userId);
  }

  @Put(':id')
  @UserAuthUpdate()
  @UseInterceptors(resourceFileUploadInterceptor)
  @UsePipes(new JoiValidationPipe(updateResourceSchema))
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @UploadedFiles() files,
    @Request() req: any,
  ) {
    let imagePath = null;
    let audioClipPath = null;
    if (files) {
      imagePath = files.image ? files.image[0].path.replace(/\\/g, '/') : null;
      audioClipPath = files.audioClip
        ? files.audioClip[0].path.replace(/\\/g, '/')
        : null;
    }
    updateResourceDto.image = imagePath;
    updateResourceDto.audioClip = audioClipPath;
    updateResourceDto.userId = req.user.userId;
    return this.resourcesService.update(+id, updateResourceDto);
  }

  @UserAuthDelete()
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const result = await this.resourcesService.remove(+id, req.user.userId);
    if (result) return { message: 'Resource deleted', status: 'success' };
    else return { message: "Can't delete the resource", status: 'failure' };
  }
}
