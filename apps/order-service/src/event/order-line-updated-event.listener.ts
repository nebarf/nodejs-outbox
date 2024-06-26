import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OrderLineUpdatedEvent,
  OrderLineUpdatedSymbol,
} from './order-line-updated.event';
import { OutboxEvent } from '../model/outbox-event.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  OrderLineUpdatedExportedEvent,
  ExportedEventCodecService,
} from '@libs/events';

@Injectable()
export class OrderLineUpdatedEventListener {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly exportedEventCode: ExportedEventCodecService,
  ) {}

  private toExportedEvent(
    event: OrderLineUpdatedEvent,
  ): OrderLineUpdatedExportedEvent {
    return OrderLineUpdatedExportedEvent.of(event);
  }

  @OnEvent(OrderLineUpdatedSymbol)
  handleOrderLineUpdatedEvent(event: OrderLineUpdatedEvent) {
    const exportedEvent = this.toExportedEvent(event);
    const outboxEvent = new OutboxEvent();

    outboxEvent.aggregateId = `${exportedEvent.orderId}`;
    outboxEvent.aggregateType = 'order';
    outboxEvent.type = exportedEvent.eventType;
    outboxEvent.payload = this.exportedEventCode.toPlain(exportedEvent);

    this.entityManager.persist(outboxEvent);
  }
}
