import { NestFactory } from '@nestjs/core';
import { ShipmentServiceModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.create(ShipmentServiceModule);
  await app.listen(3000);
}
bootstrap();
