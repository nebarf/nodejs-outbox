import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  await app.listen(process.env.SERVER_PORT ?? 3000);

  const appUrl = await app.getUrl();
  Logger.log(`Server listening on ${appUrl}`, 'Order');
}
bootstrap();
