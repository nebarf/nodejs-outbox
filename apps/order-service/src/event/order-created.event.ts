import { PurchaseOrder } from '../model/purchase-order.entity';

export const OrderCreatedSymbol = Symbol('OrderCreated');

export class OrderCreatedEvent {
  readonly order: PurchaseOrder;

  constructor(order: PurchaseOrder) {
    this.order = order;
  }
}
