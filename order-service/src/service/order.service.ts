import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  OrderCreatedEvent,
  OrderCreatedSymbol,
} from 'src/event/order-created.event';
import { PurchaseOrder } from 'src/model/purchase-order.entity';

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
}
