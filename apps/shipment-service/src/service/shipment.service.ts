import { OrderCreatedExportedEvent } from '@libs/events/order-created-event';
import { OrderLineUpdatedExportedEvent } from '@libs/events/order-line-updated.event';
import { Injectable, Logger } from '@nestjs/common';
import { Shipment } from '../model/shipment.entity';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class ShipmentService {
  private readonly logger = new Logger('ServicesModule');

  constructor(private readonly entityManager: EntityManager) {}

  orderCreated(event: OrderCreatedExportedEvent) {
    const shipment = new Shipment();

    shipment.customerId = event.customerId;
    shipment.orderDate = event.orderDate;
    shipment.orderId = event.id;

    this.entityManager.persist(shipment);
  }

  orderLineUpdated(event: OrderLineUpdatedExportedEvent) {
    this.logger.warn(`Processing of ${event.eventType} not yet implemented`);
  }
}
