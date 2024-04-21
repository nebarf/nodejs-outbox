import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { MessageLogService } from './message-log.service';

@Module({
  providers: [ShipmentService, MessageLogService],
  exports: [ShipmentService, MessageLogService],
})
export class ServicesModule {}
