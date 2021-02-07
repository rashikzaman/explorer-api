import {
  Body,
  ClassSerializerInterceptor,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../../users/models/user.entity';
import { plainToClass } from 'class-transformer';
import { SearchDto } from '../models/dto/search.dto';

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
  @UseInterceptors(ClassSerializerInterceptor) //this will remove exclude entity property
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
  @Post('verify')
  @UsePipes(new JoiValidationPipe(verificationSchema))
  async verify(@Body() verifyDto: VerifyDto) {
    const result = await this.authService.verifyUser(
      verifyDto.email,
      verifyDto.verificationCode,
    );
    if (result) return { success: true, message: 'User successfully verified' };
    else throw new UnauthorizedException();
  }

  @ApiOkResponse({ description: 'Email Exists' })
  @ApiNotFoundResponse({ description: 'Email does not exist' })
  @Post('search')
  @ApiProperty()
  async searchByEmail(@Body() searchDto: SearchDto) {
    const result = await this.authService.searchMail(searchDto.email);
    if (result) return { success: true, message: 'Email Exists' };
    else throw new NotFoundException();
  }
}
