import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent, OrderCreatedSymbol } from './order-created.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { OutboxEvent } from '../model/outbox-event.entity';
import { OrderCreatedExportedEvent } from '@libs/events/order-created-event';
import { ExportedEventCodecService } from '@libs/events/exported-event-codec.service';

@Injectable()
export class OrderCreatedListener {
  constructor(
    private readonly entityManager: EntityManager,
    private exportedEventCodec: ExportedEventCodecService,
  ) {}

  private toExportedEvent(event: OrderCreatedEvent): OrderCreatedExportedEvent {
    const { order } = event;
    const exportedEvent = OrderCreatedExportedEvent.of(order);

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
