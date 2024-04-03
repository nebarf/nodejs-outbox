import { Module } from '@nestjs/common';
import { OrderCreatedListener } from './order-created.listener';

@Module({ providers: [OrderCreatedListener] })
export class EventsModule {}
