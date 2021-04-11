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
import { ResourcesService } from '../services/resources.service';
import { CreateResourceDto } from '../models/dto/create-resource.dto';
import { UpdateResourceDto } from '../models/dto/update-resource.dto';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { S3FileService } from '../../aws/s3/services/s3-file.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private s3FileService: S3FileService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToS3(@UploadedFile() file: Express.Multer.File) {
    const result = await this.s3FileService.uploadPublicFile(
      file.buffer,
      file.originalname,
    );
    return result;
  }

  @Post()
  @UserAuthCreate()
  @UseInterceptors(resourceFileUploadInterceptor)
  @UsePipes(new JoiValidationPipe(createResourceSchema))
  create(
    @Body() createResourceDto: CreateResourceDto,
    @UploadedFiles() files,
    @Request() req,
  ) {
    let image = null;
    let audioClip = null;
    if (files && files.image) image = files.image ? files.image[0] : null;
    if (files && files.audioClip)
      audioClip = files.audioClip ? files.audioClip[0] : null;

    createResourceDto.image = image;
    createResourceDto.audioClip = audioClip;
    createResourceDto.userId = req.user.userId;
    const result = this.resourcesService.create(createResourceDto);
    return result;
  }

  @Get()
  @UserAuthFindAll()
  @ApiQuery({ name: 'pageSize' })
  @ApiQuery({ name: 'pageNumber' })
  @ApiQuery({ name: 'resourceTypeId' })
  findAll(
    @Request() req,
    @Query()
    query: { pageSize: number; pageNumber: number; resourceTypeId: number },
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
    updateResourceDto.image = files.image ? files.image[0] : null;
    updateResourceDto.audioClip = files.audioClip ? files.audioClip[0] : null;
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

  @Get('group/resource-types')
  @UserAuthFind()
  async groupResourcesByResourceTypes(@Request() req: any) {
    return this.resourcesService.groupResourcesByResourceType(req.user.userId);
  }
}
