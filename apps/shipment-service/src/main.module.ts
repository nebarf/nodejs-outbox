import { HealthModule } from '@libs/health';
import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [HealthModule, ConfigModule],
})
export class ShipmentServiceModule {}
