import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { RegisterDto } from 'src/modules/auth/models/dto/register.dto';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersAuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne(
      { email: email },
      { select: ['password', 'email', 'id', 'username'] },
    );
  }

  async registerUser(user: User): Promise<User | undefined> {
    const hashedPassword = await this.hashPassword(user.password);
    const result = await this.usersRepository.save({
      email: user.email,
      username: user.username,
      password: hashedPassword,
    });
    return result;
  }

  async resetPassword(email: string, password): Promise<User | undefined> {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersRepository.findOne({ email: email });
    user.password = hashedPassword;
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async hashPassword(password): Promise<string> {
    return bcrypt.hash(password, 6);
  }
}
