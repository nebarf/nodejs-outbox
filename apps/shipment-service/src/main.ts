import { NestFactory } from '@nestjs/core';
import { ShipmentServiceModule } from './main.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ShipmentServiceModule);
  const config = app.get(ConfigService);

  const appUrl = await app.listen(config.server.port);
  Logger.log(`Server listening on ${appUrl}`, 'Shipment');
}
bootstrap();
