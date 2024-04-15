import { Module } from '@nestjs/common';
import { OrderCreatedListener } from './order-created.listener';
import { OrderLineUpdatedListener } from './order-line-updated.listener';
import { ExportedEventsModule } from '@libs/events';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ExportedEventsModule, ConfigModule],
  providers: [OrderCreatedListener, OrderLineUpdatedListener],
})
export class EventsModule {}
