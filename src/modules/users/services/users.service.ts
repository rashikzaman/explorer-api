import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { RegisterDto } from 'src/modules/auth/models/dto/register.dto';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async findOne(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ email: email });
  }

  async registerUser(user: RegisterDto): Promise<User | undefined> {
    const password = await this.hashPassword(user.password);

    const result = await this.usersRepository.save({
      email: user.email,
      firstName: 'N/A',
      lastName: 'N/A',
      isActive: false,
      password: password,
    });
    return result;
  }

  async hashPassword(password): Promise<string> {
    return bcrypt.hash(password, 6);
  }
}
