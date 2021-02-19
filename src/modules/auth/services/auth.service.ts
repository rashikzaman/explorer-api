import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersAuthService } from '../../users/services/user-auth.service';
import { UsersService } from '../../users/services/users.service';
import { RegisterDto } from '../models/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/models/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { authEventsType } from '../events/auth-events';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTempVerification } from '../models/entity/email.temp-verification.entity';

@Injectable()
export class AuthService {
  constructor(
    private userAuthService: UsersAuthService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    @InjectRepository(EmailTempVerification)
    private emailTempVerificationRepository: Repository<EmailTempVerification>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userAuthService.findOneByEmail(email);
    if (user) {
      const match = await bcrypt.compare(pass, user.password);
      if (match) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!user.isVerified) {
      //if user is not verified, throw unauthorized exception
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User) {
    const result = await this.userAuthService.registerUser(user);
    return result;
  }

  async searchMail(email: string) {
    const result = await this.userAuthService.findOneByEmail(email);
    return result;
  }

  async createTempVerificationCode(email: string) {
    const result = await this.emailTempVerificationRepository.findOne({
      email: email,
    });
    const verificationCode = this.getVerificationCode();
    let res = null;
    if (result) {
      res = await this.emailTempVerificationRepository.save({
        ...result,
        verificationCode: verificationCode,
      });
    } else {
      res = await this.emailTempVerificationRepository.save({
        email: email,
        verificationCode: verificationCode,
      });
    }
    this.eventEmitter.emit(authEventsType.userRegistered, {
      email: res.email,
      verificationCode: res.verificationCode,
    });
    return res;
  }

  async verifyTempEmail(email: string, verificationCode: string) {
    const result = await this.emailTempVerificationRepository.findOne({
      email: email,
      verificationCode: verificationCode,
    });
    return result;
  }

  getVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
