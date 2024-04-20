import { Module } from '@nestjs/common';
import { OrderCreatedEventListener } from './order-created-event.listener';
import { OrderLineUpdatedEventListener } from './order-line-updated-event.listener';
import { ExportedEventsModule } from '@libs/events';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ExportedEventsModule, ConfigModule],
  providers: [OrderCreatedEventListener, OrderLineUpdatedEventListener],
})
export class EventsModule {}
