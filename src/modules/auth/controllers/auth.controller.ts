import { Body, Get } from '@nestjs/common';
import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginDto } from '../models/dto/login.dto';
import { RegisterDto } from '../models/dto/register.dto';
import { VerifyDto } from '../models/dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify')
  async verify(@Body() verifyDto: VerifyDto) {
    const result = await this.authService.verifyUser(verifyDto);
    if (result) return { success: true, message: 'User successfully verified' };
    else return { success: false, message: 'User can not be verified' };
  }
}
