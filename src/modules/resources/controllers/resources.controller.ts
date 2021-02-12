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
} from '@nestjs/common';
import { ResourcesService } from '../services/resources.service';
import { CreateResourceDto } from '../models/dto/create-resource.dto';
import { UpdateResourceDto } from '../models/dto/update-resource.dto';
import { getMetadata } from 'page-metadata-parser';
import * as domino from 'domino';
import * as fetch from 'node-fetch';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          callback(null, Date.now() + path.extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() createResourceDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    //return createResourceDto;
    //return this.resourcesService.create(createResourceDto);
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

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(+id, updateResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(+id);
  }
}
