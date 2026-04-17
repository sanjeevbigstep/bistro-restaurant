import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Vercel handles the port; this keeps local development working
  //if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
  //}

  // Essential for Vercel: Access and export the underlying Express instance
  await app.init();
  return app.getHttpAdapter().getInstance();
}

// Export the handler for Vercel
export default bootstrap();
