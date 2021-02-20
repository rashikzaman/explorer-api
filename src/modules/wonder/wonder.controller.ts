import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { WonderService } from './wonder.service';
import { CreateWonderDto } from './dto/create-wonder.dto';
import { UpdateWonderDto } from './dto/update-wonder.dto';

@Controller('wonder')
export class WonderController {
  constructor(private readonly wonderService: WonderService) {}

  @Post()
  create(@Body() createWonderDto: CreateWonderDto) {
    return this.wonderService.create(createWonderDto);
  }

  @Get()
  findAll() {
    return this.wonderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wonderService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateWonderDto: UpdateWonderDto) {
    return this.wonderService.update(+id, updateWonderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wonderService.remove(+id);
  }
}
