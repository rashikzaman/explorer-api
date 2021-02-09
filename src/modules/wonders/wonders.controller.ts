import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { WondersService } from './wonders.service';
import { CreateWonderDto } from './dto/create-wonder.dto';
import { UpdateWonderDto } from './dto/update-wonder.dto';

@Controller('wonders')
export class WondersController {
  constructor(private readonly wondersService: WondersService) {}

  @Post()
  create(@Body() createWonderDto: CreateWonderDto) {
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
