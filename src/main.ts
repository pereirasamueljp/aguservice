import { NestFactory } from '@nestjs/core';
import { json, text } from 'express';
import { AppModule } from './app.module';
import { sessionMiddleware } from './agu/core/middleware/session.middleware';
import * as dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { logMiddleware } from './agu/core/middleware/log.middleware';
import { logger } from './utils/logger';

dotenv.config();

if (existsSync('./envs/prod.env') && process.env.NODE_ENV !== 'production') {
  const envProducao = dotenv.parse(readFileSync('./envs/prod.env'));
  for (const k in envProducao) {
    if (envProducao.hasOwnProperty(k)) {
      process.env[k] = envProducao[k];
    }
  }
}

async function bootstrap() {
  const basePath = process.env.APIBASEPATH || '';

  const app = await NestFactory.create(AppModule, {
  });


  AppModule.appInstance = app;
  AppModule.basePath = basePath ? `/${basePath}` : null;
  
  app.enableCors();
  app.setGlobalPrefix(basePath);

  app.use(sessionMiddleware);
  app.use(json({ limit: '50mb' }));
  app.use(text());
  app.use(logMiddleware)
  logger.info(` DB: ${process.env.DBHOST}`)
  logger.info(` DBNAME: ${process.env.DATABASE}`)
  logger.info(` DBPORT: ${process.env.DBPORT}`)
  logger.info(` NODE_ENV: ${process.env.NODE_ENV}`);
  logger.info(` APPPORT: ${process.env.PORT}`)
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
