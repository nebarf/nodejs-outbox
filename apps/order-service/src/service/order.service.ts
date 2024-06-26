import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UUID } from 'node:crypto';
import { PurchaseOrder } from '../model/purchase-order.entity';
import {
  OrderCreatedEvent,
  OrderCreatedSymbol,
} from '../event/order-created.event';
import { OrderLineStatus } from '../model/order-line.entity';
import {
  OrderLineUpdatedEvent,
  OrderLineUpdatedSymbol,
} from '../event/order-line-updated.event';
import { EntityNotFoundException } from '../errors/entity-not-found';

@Injectable()
export class OrderService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async addOrder(order: PurchaseOrder): Promise<PurchaseOrder> {
    this.entityManager.persist(order);
    this.eventEmitter.emit(OrderCreatedSymbol, new OrderCreatedEvent(order));

    await this.entityManager.flush();

    return order;
  }

  async updateOrderLine({
    orderId,
    orderLineId,
    orderLineStatus,
  }: {
    orderId: UUID;
    orderLineId: UUID;
    orderLineStatus: OrderLineStatus;
  }): Promise<PurchaseOrder> {
    const order = await this.entityManager.findOneOrFail(
      PurchaseOrder,
      orderId,
      {
        populate: ['lineItems'],
        failHandler: () =>
          new EntityNotFoundException(`Order with id ${orderId} was not found`),
      },
    );

    const orderLineOldStatus = order.updateLineItemStatus(
      orderLineId,
      orderLineStatus,
    );

    this.eventEmitter.emit(
      OrderLineUpdatedSymbol,
      new OrderLineUpdatedEvent({
        newStatus: orderLineStatus,
        oldStatus: orderLineOldStatus,
        orderId,
        orderLineId,
      }),
    );

    await this.entityManager.flush();

    return order;
  }
}
