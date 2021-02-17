import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';

describe('App Api', () => {
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
          database: 'wondered-db', //need to change this database
          entities: ['src/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  let jwtToken: any;

  it(`if email and password is not present, it should return 401`, () => {
    return request(app.getHttpServer()).post('/auth/login').expect(401);
  });

  it(`if user tries to register without proper post body, it should return 400`, () => {
    return request(app.getHttpServer()).post('/auth/register').expect(400);
  });

  it(`if user access profile without valid access token, it should return 401`, () => {
    return request(app.getHttpServer()).get('/profile').expect(401);
  });

  it(`if email and password is present, it should return 200`, async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'rashikzaman22@gmail.com', password: '123456' });
    expect(res.status).toBe(200);
    jwtToken = res.body.access_token; //saving jwtToken for future reference
  });

  it(`if email or password incorrect, it should return 401`, async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'rashikzaman22@gmail.com', password: '123456999' });
    expect(res.status).toBe(401);
  });

  it(`if user access profile with correct jwt token, it should return 200`, async () => {
    return request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });

  it(`if email exists, then should return 200`, async () => {
    return request(app.getHttpServer())
      .get(`/auth/search?email=rashikzaman22@gmail.com`)
      .expect(200);
  });

  it(`if email does not exist, then should return 404`, async () => {
    return request(app.getHttpServer())
      .get(`/auth/search?email=rashikzaman22222222@gmail.com`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
