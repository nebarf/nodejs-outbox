import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.server.port);

  const appUrl = await app.getUrl();
  Logger.log(`Server listening on ${appUrl}`, 'Order');
}
bootstrap();
