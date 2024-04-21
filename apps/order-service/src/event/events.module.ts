import { Module } from '@nestjs/common';
import { ExportedEventsModule } from '@libs/events';
import { OrderCreatedEventListener } from './order-created-event.listener';
import { OrderLineUpdatedEventListener } from './order-line-updated-event.listener';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ExportedEventsModule, ConfigModule],
  providers: [OrderCreatedEventListener, OrderLineUpdatedEventListener],
})
export class EventsModule {}
