import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ConfigService } from './config/config.service';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(config.server.port);

  const appUrl = await app.getUrl();
  Logger.log(`Server listening on ${appUrl}`, 'Shipment');
}
bootstrap();
