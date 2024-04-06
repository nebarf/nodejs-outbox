import { HealthModule } from '@libs/health';
import { Module } from '@nestjs/common';

@Module({
  imports: [HealthModule],
})
export class ShipmentServiceModule {}
