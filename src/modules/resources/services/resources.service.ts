import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from '../models/dto/create-resource.dto';
import { UpdateResourceDto } from '../models/dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  create(createResourceDto: CreateResourceDto) {
    return 'This action adds a new resource';
  }

  findAll() {
    return `This action returns all resources`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resource`;
  }

  update(id: number, updateResourceDto: UpdateResourceDto) {
    return `This action updates a #${id} resource`;
  }

  remove(id: number) {
    return `This action removes a #${id} resource`;
  }
}
