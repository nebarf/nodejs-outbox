import { Module } from '@nestjs/common';
import { ExportedEventCodecService } from './exported-event-codec.service';
@Module({
  providers: [ExportedEventCodecService],
  exports: [ExportedEventCodecService],
})
export class ExportedEventsModule {}
