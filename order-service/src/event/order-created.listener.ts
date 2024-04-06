import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent, OrderCreatedSymbol } from './order-created.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { OutboxEvent } from 'src/model/outbox-event.entity';

@Injectable()
export class OrderCreatedListener {
  constructor(private readonly entityManager: EntityManager) {}

  @OnEvent(OrderCreatedSymbol)
  handleOrderCreatedEvent(event: OrderCreatedEvent) {
    const outboxEvent = new OutboxEvent();

    outboxEvent.aggregateId = `${event.order.id}`;
    outboxEvent.aggregateType = 'Order';
    outboxEvent.type = 'OrderCreated';
    outboxEvent.payload = {
      id: event.order.id,
      customerId: event.order.customerId,
      orderDate: event.order.orderDate,
      lineItems: event.order.lineItems.toArray().map((orderLine) => ({
        id: orderLine.id,
        item: orderLine.item,
        quantity: orderLine.quantity,
        totalPrice: orderLine.totalPrice,
        status: orderLine.status,
      })),
    };

    this.entityManager.persist(outboxEvent);
  }
}
