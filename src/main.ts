import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // for using class validation we need to make ValidationPipe global. 
  app.useGlobalPipes(new ValidationPipe({
    // this will remove all the properties that are not in the DTO
    whitelist: true,
  }));
  await app.listen(3333);
}
bootstrap();
