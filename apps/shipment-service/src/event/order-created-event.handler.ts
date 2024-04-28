import {
  EventType,
  ExportedEventCodecService,
  OrderCreatedExportedEvent,
} from '@libs/events';
import { ExportedEventHandler } from './exported-event.handler';
import { Result } from '@libs/monads';
import { Injectable } from '@nestjs/common';
import { Shipment } from '../model/shipment.entity';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class OrderCreatedEventHandler extends ExportedEventHandler<EventType.OrderCreated> {
  constructor(
    private readonly exportedEventCodec: ExportedEventCodecService,
    private readonly entityManager: EntityManager,
  ) {
    super();
  }

  parse(
    plain: Record<string, unknown>,
  ): Result<OrderCreatedExportedEvent, Error> {
    return this.exportedEventCodec.parse(plain, OrderCreatedExportedEvent);
  }

  handle(event: OrderCreatedExportedEvent): void {
    const shipment = new Shipment();

    shipment.customerId = event.customerId;
    shipment.orderDate = new Date(event.orderDate);
    shipment.orderId = event.id;

    this.entityManager.persist(shipment);
  }
}
