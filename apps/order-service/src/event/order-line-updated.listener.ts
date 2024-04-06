import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OrderLineUpdatedEvent,
  OrderLineUpdatedSymbol,
} from './order-line-updated.event';

@Injectable()
export class OrderLineUpdatedListener {
  @OnEvent(OrderLineUpdatedSymbol)
  handleOrderLineUpdatedEvent(event: OrderLineUpdatedEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log(event);
  }
}
