import { Controller, Get, UseGuards, Request } from '@nestjs/common';

import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
