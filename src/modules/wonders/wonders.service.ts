import { Injectable } from '@nestjs/common';
import { CreateWonderDto } from './dto/create-wonder.dto';
import { UpdateWonderDto } from './dto/update-wonder.dto';

@Injectable()
export class WondersService {
  create(createWonderDto: CreateWonderDto) {
    return 'This action adds a new wonder';
  }

  findAll() {
    return `This action returns all wonders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wonder`;
  }

  update(id: number, updateWonderDto: UpdateWonderDto) {
    return `This action updates a #${id} wonder`;
  }

  remove(id: number) {
    return `This action removes a #${id} wonder`;
  }
}
