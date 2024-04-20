import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent, OrderCreatedSymbol } from './order-created.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { OutboxEvent } from '../model/outbox-event.entity';
import { OrderCreatedExportedEvent } from '@libs/events/order-created-event';
import { ExportedEventCodecService } from '@libs/events/exported-event-codec.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class OrderCreatedEventListener {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly exportedEventCodec: ExportedEventCodecService,
    private readonly config: ConfigService,
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
    outboxEvent.aggregateType = this.config.events.channel;
    outboxEvent.type = exportedEvent.eventType;
    outboxEvent.payload = this.exportedEventCodec.toPlain(exportedEvent);

    this.entityManager.persist(outboxEvent);
  }
}
