import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { RegisterDto } from 'src/modules/auth/models/dto/register.dto';
import { Repository } from 'typeorm';
import { User } from '../models/entity/user.entity';
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

  async changePassord(
    email: string,
    oldPassWord: string,
    newPassword: string,
    newPasswordConfirmation: string,
  ) {
    if (newPassword !== newPasswordConfirmation) {
      throw new BadRequestException("Password doesn't match!");
    }
    const user = await this.findOneByEmail(email);
    if (user) {
      const match = await bcrypt.compare(oldPassWord, user.password);
      if (match) {
        const hashedPassword = await this.hashPassword(newPassword);
        user.password = hashedPassword;
        const savedUser = await this.usersRepository.save(user);
        return savedUser;
      } else {
        throw new BadRequestException("Old password doesn't match");
      }
    } else {
      throw new NotFoundException('User not found!');
    }
  }

  async hashPassword(password): Promise<string> {
    return bcrypt.hash(password, 6);
  }
}
