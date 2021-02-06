import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersAuthService } from '../../users/services/user-auth.service';
import { UsersService } from '../../users/services/users.service';
import { RegisterDto } from '../models/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { VerifyDto } from '../models/dto/verify.dto';
import { User } from 'src/modules/users/models/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { authEventsType } from '../events/auth-events';

@Injectable()
export class AuthService {
  constructor(
    private userAuthService: UsersAuthService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
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

    this.eventEmitter.emit(authEventsType.userRegistered, {
      email: result.email,
      verificationCode: result.verificationCode,
    });

    return result;
  }

  async verifyUser(email: string, verificationCode: string) {
    const result = await this.userAuthService.verifyUser(
      email,
      verificationCode,
    );
    return result;
  }
}
