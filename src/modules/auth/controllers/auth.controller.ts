import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Query,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../models/dto/login.dto';
import { RegisterDto } from '../models/dto/register.dto';
import { registrationSchema } from '../validation-schemas/schemas';
import { JoiValidationPipe } from '../../../validation.pipe';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../../users/models/user.entity';
import { plainToClass } from 'class-transformer';

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

  @ApiCreatedResponse({ description: 'User Registered' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UsePipes(new JoiValidationPipe(registrationSchema))
  @UseInterceptors(ClassSerializerInterceptor) //this will remove exclude entity property
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    try {
      const userEntity = plainToClass(User, registerDto, {
        ignoreDecorators: true,
      });
      const result = await this.authService.register(userEntity);
      return new User(result);
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
  @ApiQuery({ name: 'email', type: String })
  @ApiQuery({ name: 'verificationCode', type: String })
  @Get('verify')
  async verify(
    @Query('email') email,
    @Query('verificationCode') verificationCode,
  ) {
    if (!email || !verificationCode)
      throw new BadRequestException('Email and Verification code required');

    const result = await this.authService.verifyUser(email, verificationCode);
    if (result) return { success: true, message: 'User successfully verified' };
    else throw new UnauthorizedException();
  }

  @HttpCode(200)
  @ApiOkResponse({ description: 'Email Exists' })
  @ApiNotFoundResponse({ description: 'Email does not exist' })
  @ApiQuery({ name: 'email', type: String })
  @ApiQuery({ name: 'email', type: String })
  @Get('search')
  async searchByEmail(@Query('email') email) {
    if (!email) throw new BadRequestException('Email is required');

    const result = await this.authService.searchMail(email);
    if (result)
      return {
        success: true,
        message: 'Email Exists',
        username: result.username,
      };
    else throw new NotFoundException();
  }
}
