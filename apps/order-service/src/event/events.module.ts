import { Module } from '@nestjs/common';
import { OrderCreatedListener } from './order-created.listener';
import { OrderLineUpdatedListener } from './order-line-updated.listener';

@Module({ providers: [OrderCreatedListener, OrderLineUpdatedListener] })
export class EventsModule {}
