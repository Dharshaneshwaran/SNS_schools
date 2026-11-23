import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  // Files written by UploadsController live under <cwd>/uploads and are
  // handed back as /files/<folder>/<name>. Without this mapping every
  // uploaded avatar, document and gallery image 404s.
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/files' });
  const allowedOrigins = appConfig.frontendOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      // Allow explicitly configured origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow any Vercel preview deployment dynamically
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      // Fallback if no specific origins are set
      if (!allowedOrigins.length) return callback(null, true);
      
      callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(appConfig.port);
}
void bootstrap();
