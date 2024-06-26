import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent, OrderCreatedSymbol } from './order-created.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { OutboxEvent } from '../model/outbox-event.entity';
import {
  OrderCreatedExportedEvent,
  ExportedEventCodecService,
} from '@libs/events';

@Injectable()
export class OrderCreatedEventListener {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly exportedEventCodec: ExportedEventCodecService,
  ) {}

  private toExportedEvent(event: OrderCreatedEvent): OrderCreatedExportedEvent {
    const { order } = event;
    const exportedEvent = OrderCreatedExportedEvent.of({
      customerId: order.customerId,
      id: order.id,
      orderDate: order.orderDate.toISOString(),
    });

    return exportedEvent;
  }

  @OnEvent(OrderCreatedSymbol)
  handleOrderCreatedEvent(event: OrderCreatedEvent) {
    const exportedEvent = this.toExportedEvent(event);
    const outboxEvent = new OutboxEvent();

    outboxEvent.aggregateId = `${exportedEvent.id}`;
    outboxEvent.aggregateType = 'order';
    outboxEvent.type = exportedEvent.eventType;
    outboxEvent.payload = this.exportedEventCodec.toPlain(exportedEvent);

    this.entityManager.persist(outboxEvent);
  }
}
