import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) {}

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  getEnv(): string {
    return this.configService.get('DATABASE_PASSWORD');
  }
}
