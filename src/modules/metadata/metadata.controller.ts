import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  Query

} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadatumDto } from './dto/create-metadatum.dto';
import { UpdateMetadatumDto } from './dto/update-metadatum.dto';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}
  @ApiOkResponse()
  @ApiQuery({ name: 'url' })
  @Get('parser')
  async find(@Query() query: any) {
    const metadata = this.metadataService.parse(query.url);
    return metadata;
  }
}
