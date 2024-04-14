import { Module } from '@nestjs/common';
import { OrderCreatedListener } from './order-created.listener';
import { OrderLineUpdatedListener } from './order-line-updated.listener';
import { ExportedEventsModule } from '@libs/events';

@Module({
  imports: [ExportedEventsModule],
  providers: [OrderCreatedListener, OrderLineUpdatedListener],
})
export class EventsModule {}
