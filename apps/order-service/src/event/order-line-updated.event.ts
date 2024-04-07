import { OrderLineStatus } from '../model/order-line.entity';

export const OrderLineUpdatedSymbol = Symbol('OrderLineUpdated');

export class OrderLineUpdatedEvent {
  readonly orderId: number;
  readonly orderLineId: number;
  readonly newStatus: OrderLineStatus;
  readonly oldStatus: OrderLineStatus;

  constructor({
    newStatus,
    oldStatus,
    orderId,
    orderLineId,
  }: {
    orderId: number;
    orderLineId: number;
    newStatus: OrderLineStatus;
    oldStatus: OrderLineStatus;
  }) {
    this.newStatus = newStatus;
    this.oldStatus = oldStatus;
    this.orderId = orderId;
    this.orderLineId = orderLineId;
  }
}
