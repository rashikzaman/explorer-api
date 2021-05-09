import { applyDecorators, HttpCode } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { JwtOptionalAuthGuard } from 'src/modules/auth/guards/jw-optional-auth.guard';

export function UserAuthCreate() {
  return applyDecorators(
    HttpCode(201),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse,
    ApiCreatedResponse,
  );
}

export function UserAuthUpdate() {
  return applyDecorators(
    HttpCode(200),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOkResponse(),
    ApiUnauthorizedResponse(),
    ApiNotFoundResponse(),
  );
}

export function UserAuthFind() {
  return applyDecorators(
    HttpCode(200),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOkResponse(),
    ApiUnauthorizedResponse(),
    ApiNotFoundResponse(),
  );
}

export function UserAuthFindAll() {
  return applyDecorators(
    HttpCode(200),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOkResponse(),
    ApiUnauthorizedResponse(),
    ApiNotFoundResponse(),
  );
}

export function UserAuthDelete() {
  return applyDecorators(
    HttpCode(200),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOkResponse(),
    ApiUnauthorizedResponse(),
    ApiNotFoundResponse(),
  );
}

export function UserOptionalAuthFindAll() {
  return applyDecorators(
    HttpCode(200),
    UseGuards(JwtOptionalAuthGuard),
    ApiOkResponse(),
    ApiNotFoundResponse(),
  );
}

export function UserOptionalAuthFind() {
  return applyDecorators(
    HttpCode(200),
    UseGuards(JwtOptionalAuthGuard),
    ApiOkResponse(),
    ApiNotFoundResponse(),
  );
}
