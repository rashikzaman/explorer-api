import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersAuthService } from 'src/modules/users/services/user-auth.service';
import { UsersService } from '../../users/services/users.service';
import { RegisterDto } from '../models/dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userAuthService: UsersAuthService,
    private jwtService: JwtService,
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

  async login(user: any) {
    const payload = { id: user.id, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterDto) {
    try {
      const { password, ...result } = await this.userAuthService.registerUser(
        user,
      );
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
