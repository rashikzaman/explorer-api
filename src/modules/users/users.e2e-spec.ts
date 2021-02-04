import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../app.module';

describe('User Service', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'test',
          entities: ['src/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET profile`, () => {
    return request(app.getHttpServer()).get('/profile').expect(401);
  });
  afterAll(async () => {
    await app.close();
  });
});
