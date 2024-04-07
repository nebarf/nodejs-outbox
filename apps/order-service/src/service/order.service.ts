import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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

@Injectable()
export class OrderService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async addOrder(order: PurchaseOrder): Promise<PurchaseOrder> {
    await this.entityManager.begin();

    try {
      await this.entityManager.persistAndFlush(order);

      this.eventEmitter.emit(OrderCreatedSymbol, new OrderCreatedEvent(order));

      await this.entityManager.flush();
      await this.entityManager.commit();

      return order;
    } catch (e) {
      await this.entityManager.rollback();
      throw e;
    }
  }

  async updateOrderLine({
    orderId,
    orderLineId,
    orderLineStatus,
  }: {
    orderId: number;
    orderLineId: number;
    orderLineStatus: OrderLineStatus;
  }): Promise<PurchaseOrder> {
    const order = await this.entityManager.findOneOrFail(
      PurchaseOrder,
      orderId,
      { populate: ['lineItems'] },
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
