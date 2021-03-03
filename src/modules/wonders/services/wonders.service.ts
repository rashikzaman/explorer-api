import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWonderDto } from '../models/dto/create-wonder.dto';
import { UpdateWonderDto } from '../models/dto/update-wonder.dto';
import { Wonder } from '../models/entities/wonder.entity';
import { User } from '../../users/models/user.entity';

@Injectable()
export class WondersService {
  constructor(
    @InjectRepository(Wonder)
    private wonderRepository: Repository<Wonder>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    createWonderDto: CreateWonderDto,
  ): Promise<Wonder | undefined | string> {
    const user = await this.userRepository.findOne(createWonderDto.userId);

    const wonder = await this.wonderRepository.save({
      title: createWonderDto.title,
      description: createWonderDto.description,
      coverPhotoUrl: createWonderDto.coverPhoto,
      visibilityId: createWonderDto.visibilityId,
      user: user,
    });
    return wonder;
  }

  async findAll(): Promise<Wonder[] | undefined | string> {
    const wonders = await this.wonderRepository.find({
      relations: ['user', 'visibility'],
    });
    return wonders;
  }

  async findOne(id: number): Promise<Wonder | undefined | string> {
    return `This action returns a #${id} wonder`;
  }

  async update(
    id: number,
    updateWonderDto: UpdateWonderDto,
  ): Promise<Wonder | undefined | string> {
    return `This action updates a #${id} wonder`;
  }

  async remove(id: number): Promise<any> {
    return `This action removes a #${id} wonder`;
  }
}
