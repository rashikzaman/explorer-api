/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
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
          password: '123456',
          database: 'wondered-db', //need to change this database
          entities: ['src/**/*.entity{.ts,.js}'],
          synchronize: false,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    try {
      await app.init();
    } catch (e) {
      console.log('App Initialization Failed', e);
    }
  });

  let jwtToken: any;
  let resourceId: any;
  let wonderId: any;

  /** Authentication begins */

  it(`Auth: if email and password is not present, it should return 401`, () => {
    return request(app.getHttpServer()).post('/auth/login').expect(401);
  });

  it(`Auth: if user tries to register without proper post body, it should return 400`, () => {
    return request(app.getHttpServer()).post('/auth/register').expect(400);
  });

  it(`Auth: if user access profile without valid access token, it should return 401`, () => {
    return request(app.getHttpServer()).get('/profile').expect(401);
  });

  it(`Auth: if email and password is present, it should return 200`, async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'rashikzaman22@gmail.com', password: '123456' });
    expect(res.status).toBe(200);
    jwtToken = res.body.accessToken; //saving jwtToken for future reference
  });

  it(`Auth: if email or password incorrect, it should return 401`, async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'rashikzaman22@gmail.com', password: '123456999' });
    expect(res.status).toBe(401);
  });

  it(`Auth: if user access profile with correct jwt token, it should return 200`, async () => {
    return request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });

  it(`Auth: if email exists, then should return 200`, async () => {
    return request(app.getHttpServer())
      .get(`/auth/search?email=rashikzaman22@gmail.com`)
      .expect(200);
  });

  it(`Auth: if email does not exist, then should return 404`, async () => {
    return request(app.getHttpServer())
      .get(`/auth/search?email=rashikzaman22222222@gmail.com`)
      .expect(404);
  });

  /** Authentication ends */

  /** Resources Begin */

  it(`if requesting without proper authorization, it should return 401`, () => {
    return request(app.getHttpServer()).post('/resources').expect(401);
  });

  it(`Resource: if requesting without required request body, it should return 400`, () => {
    return request(app.getHttpServer())
      .post('/resources')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400);
  });

  it(`Resource: if requesting with required request body, it should return 201`, async () => {
    const result = await request(app.getHttpServer())
      .post('/resources')
      .send({
        title: 'test resource',
        resourceTypeId: '1',
        visibilityTypeId: '3',
        keywords: ['test', 'resource'],
      })
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(201);
    resourceId = result.body.id;
  });

  it(`Resource: if requesting all resources, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .get('/resources')
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });

  it(`Resource: if requesting one resources with parameter, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .get(`/resources/${resourceId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });

  it(`Resource: if deleting one resource with parameter, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .delete(`/resources/${resourceId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });

  it(`Resource: if fetching resources with pageSize, pageNumber and resourceId, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .get(`/resources?pageSize=30&pageNumber=1&resourceTypeId=1`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });

  /** Resources End */

  /** Wonder begins */

  it(`Wonder: if posting wonder without proper authorization, it should return 401`, () => {
    return request(app.getHttpServer()).post('/wonders').expect(401);
  });

  it(`Wonder: if posting wonder without required request body, it should return 400`, () => {
    return request(app.getHttpServer())
      .post('/wonders')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400);
  });

  it(`Wonder: if requesting with required request body, it should return 201`, async () => {
    const result = await request(app.getHttpServer())
      .post('/wonders')
      .send({
        title: 'test wonder',
        visibilityId: '3',
        description: 'This is a test wonder',
      })
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(201);
    wonderId = result.body.id;
  });

  it(`Wonder: if requesting all wonders, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .get('/wonders')
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });

  it(`Wonder: if requesting one wonder with parameter, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .get(`/wonders/${wonderId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });

  it(`Wonder: if deleting one wonder with parameter, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .delete(`/wonders/${wonderId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });

  /** Wonder ends */

  /** Search Starts */

  it(`Search: if search with a search term, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .get(`/search?term=r`);
    expect(result.status).toBe(200);
  });

  it(`Search Profile: if search with a search term but without token, it should return 401`, async () => {
    const result = await request(app.getHttpServer())
      .get(`/search/profile?term=r`);
    expect(result.status).toBe(401);
  });

  it(`Search Profile: if search with a search term but with token, it should return 200`, async () => {
    const result = await request(app.getHttpServer())
      .get(`/search/profile?term=r`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(result.status).toBe(200);
  });
  
  /** Search Ends */

  afterAll(async () => {
    await app.close();
  });
});
