import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
        expect(body.service).toBe('sns-erp-backend');
      });
  });

  it('/auth/login (POST)', () => {
    process.env.DEMO_USER_PASSWORD = 'ChangeMe123!';
    process.env.DEMO_USER_EMAIL = 'teacher@sns-erp.local';

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@sns-erp.local',
        password: 'ChangeMe123!',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.accessToken).toEqual(expect.any(String));
        expect(body.refreshToken).toEqual(expect.any(String));
        expect(body.user.email).toBe('admin@sns-erp.local');
        expect(body.user.role).toBe('admin');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
