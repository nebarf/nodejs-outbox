import { Module } from '@nestjs/common';
import { ShipmentServiceController } from './shipment-service.controller';
import { ShipmentServiceService } from './shipment-service.service';

@Module({
  imports: [],
  controllers: [ShipmentServiceController],
  providers: [ShipmentServiceService],
})
export class ShipmentServiceModule {}
