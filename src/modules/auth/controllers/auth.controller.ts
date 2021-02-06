import {
  Body,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginDto } from '../models/dto/login.dto';
import { RegisterDto } from '../models/dto/register.dto';
import { VerifyDto } from '../models/dto/verify.dto';
import {
  registrationSchema,
  verificationSchema,
} from '../validation-schemas/schemas';
import { JoiValidationPipe } from '../../../validation.pipe';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { registerDtoToUser } from '../helpers/dtoToEntityHelpers';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  @ApiCreatedResponse({ description: 'User Registered' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UsePipes(new JoiValidationPipe(registrationSchema))
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = registerDtoToUser(registerDto);
      const result = await this.authService.register(user);
      return result;
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY')
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Duplicate Entry',
          },
          HttpStatus.BAD_REQUEST,
        );
      else throw e;
    }
  }

  @HttpCode(200)
  @ApiOkResponse({ description: 'User is verified' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @Post('verify')
  @UsePipes(new JoiValidationPipe(verificationSchema))
  async verify(@Body() verifyDto: VerifyDto) {
    const result = await this.authService.verifyUser(verifyDto);
    if (result) return { success: true, message: 'User successfully verified' };
    else throw new UnauthorizedException();
  }
}
