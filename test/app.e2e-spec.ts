import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';

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
          synchronize: false,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  let jwtToken: any;
  let resourceId: any;

  /** Authentication begins */

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
      .post('/auth/search')
      .send({ email: 'rashikzaman22@gmail.com' })
      .expect(200);
  });

  it(`if email does not exist, then should return 404`, async () => {
    return request(app.getHttpServer())
      .post('/auth/search')
      .send({ email: 'wer23444rashikzaman22@gmail.com' })
      .expect(404);
  });

  /** Authentication ends */

  /** Resources Begin */

  it(`if requesting without proper authorization, it should return 401`, () => {
    return request(app.getHttpServer()).post('/resources').expect(401);
  });

  it(`if requesting without required request body, it should return 400`, () => {
    return request(app.getHttpServer())
      .post('/resources')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400);
  });

  it(`if requesting with required request body, it should return 201`, async () => {
    const result = await request(app.getHttpServer())
      .post('/resources')
      .send({
        title: 'test resource',
        resourceTypeId: '1',
        visibilityTypeId: '3',
      })
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(201);
    resourceId = result.body.id;
  });

  it(`if requesting all resources, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .get('/resources')
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });

  it(`if requesting one resources with parameter, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .get(`/resources/${resourceId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });

  it(`if deleting one resource with parameter, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .delete(`/resources/${resourceId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });

  /** Resources End */

  afterAll(async () => {
    await app.close();
  });
});
