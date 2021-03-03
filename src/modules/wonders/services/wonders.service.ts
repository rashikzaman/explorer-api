import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async create(createWonderDto: CreateWonderDto): Promise<Wonder | undefined> {
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

  async findAll(userId: string): Promise<Wonder[] | undefined> {
    const user = await this.getUser(userId);
    const wonders = await this.wonderRepository.find({
      relations: ['user', 'visibility'],
      where: { ...(user && { user: user }) },
    });

    return wonders;
  }

  async findOne(id: number, userId: string): Promise<Wonder | undefined> {
    const user = await this.getUser(userId);
    const wonder = await this.wonderRepository.findOne(id, {
      relations: ['user', 'visibility'],
      where: { ...(user && { user: user }) },
    });
    if (!wonder) throw new NotFoundException();
    return wonder;
  }

  async update(
    id: number,
    updateWonderDto: UpdateWonderDto,
  ): Promise<Wonder | undefined | string> {
    return `This action updates a #${id} wonder`;
  }

  async remove(id: number, userId: string): Promise<any> {
    const user = await this.getUser(userId);
    const wonder = await this.wonderRepository.findOne(id, {
      relations: ['user'],
    });

    if (!wonder) throw new NotFoundException();

    if (user) {
      if (wonder.user.id !== user.id) throw new UnauthorizedException(); //Wonder user must be equal to user who is deleting it, otherwise throw unauthorized exception
    }

    const result = await this.wonderRepository.delete(id);
    if (!result || result.affected === 0) throw new NotFoundException();

    return result;
  }

  async getUser(userId): Promise<User | null> {
    if (!userId) return null;
    const user = this.userRepository.findOne(userId);
    return user;
  }
}
