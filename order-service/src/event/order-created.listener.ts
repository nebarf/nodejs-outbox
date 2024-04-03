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
    console.log(event);

    const outboxEvent = new OutboxEvent();
    this.entityManager.persist(outboxEvent);
  }
}
