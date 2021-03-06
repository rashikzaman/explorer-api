import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
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
import { User } from '../../users/models/entity/user.entity';
import { plainToClass } from 'class-transformer';
import { PasswordResetTokenRequestDto } from '../models/dto/password-reset-token-request.dto';
import { PasswordResetTokenDto } from '../models/dto/password-reset-token.dto ';

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
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    try {
      const userEntity = plainToClass(User, registerDto, {
        ignoreDecorators: true,
      });
      const result = await this.authService.register(userEntity);
      const accessToken = this.authService.createAccessToken({ id: result.id });
      return {
        accessToken: accessToken,
      };
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
    else {
      await this.authService.createTempVerificationCode(email);
      throw new NotFoundException();
    }
  }

  @HttpCode(200)
  @ApiOkResponse({ description: 'Temp User Email is verified' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiQuery({ name: 'email', type: String })
  @ApiQuery({ name: 'verificationCode', type: String })
  @Get('temp-email-verification')
  async verifyTempEmail(
    @Query('email') email,
    @Query('verificationCode') verificationCode,
  ) {
    if (!email || !verificationCode)
      throw new BadRequestException('Email and Verification code required');

    const result = await this.authService.verifyTempEmail(
      email,
      verificationCode,
    );
    if (result) return { success: true, message: 'User successfully verified' };
    else throw new UnauthorizedException();
  }

  @HttpCode(201)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Post('request-password-reset')
  async requestResetPassword(
    @Body() passwordResetRequestTokenDto: PasswordResetTokenRequestDto,
  ) {
    if (!passwordResetRequestTokenDto.email)
      throw new BadRequestException('Email required');

    const result = await this.authService.createPasswordResetToken(
      passwordResetRequestTokenDto.email,
    );
    if (result)
      return {
        success: true,
        message: 'Password reset link has been sent to your email',
      };
    else throw new InternalServerErrorException();
  }

  @HttpCode(200)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Post('password-reset')
  async resetPassword(@Body() passwordResetTokenDto: PasswordResetTokenDto) {
    if (
      !passwordResetTokenDto.email ||
      !passwordResetTokenDto.token ||
      !passwordResetTokenDto.password
    )
      throw new BadRequestException('Email, token and password required');

    const result = await this.authService.acceptPasswordResetToken(
      passwordResetTokenDto.email,
      passwordResetTokenDto.token,
      passwordResetTokenDto.password,
    );
    if (result)
      return {
        success: true,
        message: 'Password successfully reset!',
      };
  }
}
