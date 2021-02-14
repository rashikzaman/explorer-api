import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  UsePipes,
  HttpCode,
  UploadedFiles,
} from '@nestjs/common';
import { ResourcesService } from '../services/resources.service';
import { CreateResourceDto } from '../models/dto/create-resource.dto';
import { UpdateResourceDto } from '../models/dto/update-resource.dto';
import { getMetadata } from 'page-metadata-parser';
import * as domino from 'domino';
import * as fetch from 'node-fetch';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  audioFileUploadInterceptor,
  imageFileFilter,
  imageFileUploadInterceptor,
  resourceFileDestinationUploader,
  resourceFileFilter,
  updateFileName,
} from '../../../utils/file-upload';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JoiValidationPipe } from '../../../validation.pipe';
import {
  createResourceSchema,
  updateResourceSchema,
} from '../validation-schemas/schemas';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'audioClip', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: resourceFileDestinationUploader,
          filename: updateFileName,
        }),
      },
    ),
  )
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
  findAll() {
    return this.resourcesService.findAll();
  }

  @Get('metadata')
  async parseMetadata(@Query('url') url: string): Promise<any> {
    const response = await fetch(url);
    const html = await response.text();
    const doc = domino.createWindow(html).document;
    const metadata = getMetadata(doc, url);
    return metadata;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(+id);
  }

  @HttpCode(200)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(imageFileUploadInterceptor)
  @UsePipes(new JoiValidationPipe(updateResourceSchema))
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    let filepath = null;
    if (file) filepath = file.path.replace(/\\/g, '/'); //remove double slashes
    updateResourceDto.image = filepath;
    updateResourceDto.userId = req.user.userId;
    return this.resourcesService.update(+id, updateResourceDto);
  }

  @HttpCode(200)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.resourcesService.remove(+id);
    if (result) return { message: 'Resource deleted', status: 'success' };
    else return { message: "Can't delete the resource", status: 'failure' };
  }
}
