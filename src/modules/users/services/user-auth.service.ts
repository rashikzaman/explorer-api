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
      { select: ['password', 'email', 'id', 'isVerified', 'username'] },
    );
  }

  async registerUser(user: User): Promise<User | undefined> {
    const hashedPassword = await this.hashPassword(user.password);
    const verificationCode = this.getVerificationCode();
    const result = await this.usersRepository.save({
      email: user.email,
      username: user.username,
      isVerified: false,
      password: hashedPassword,
      verificationCode: verificationCode,
    });
    return result;
  }

  async verifyUser(
    email: string,
    verificationCode: string,
  ): Promise<boolean | undefined> {
    const user = await this.usersRepository.findOne(
      { email: email },
      { select: ['verificationCode', 'id'] },
    );
    if (user && user.verificationCode === verificationCode) {
      user.isVerified = true;
      await this.usersRepository.save(user);
      return true;
    } else return false;
  }

  async hashPassword(password): Promise<string> {
    return bcrypt.hash(password, 6);
  }

  getVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
