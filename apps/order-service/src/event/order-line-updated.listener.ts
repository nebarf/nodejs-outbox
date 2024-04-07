import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OrderLineUpdatedEvent,
  OrderLineUpdatedSymbol,
} from './order-line-updated.event';
import { OutboxEvent } from '../model/outbox-event.entity';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class OrderLineUpdatedListener {
  constructor(private readonly entityManager: EntityManager) {}

  @OnEvent(OrderLineUpdatedSymbol)
  handleOrderLineUpdatedEvent(event: OrderLineUpdatedEvent) {
    const outboxEvent = new OutboxEvent();

    outboxEvent.aggregateId = `${event.orderId}`;
    outboxEvent.aggregateType = 'order';
    outboxEvent.type = 'OrderLineUpdated';

    outboxEvent.payload = {
      orderId: event.orderId,
      orderLineId: event.orderLineId,
      oldStatus: event.oldStatus,
      newStatus: event.newStatus,
    };

    this.entityManager.persist(outboxEvent);
  }
}
