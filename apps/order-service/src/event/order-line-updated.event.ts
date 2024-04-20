import { UUID } from 'crypto';
import { OrderLineStatus } from '../model/order-line.entity';

export const OrderLineUpdatedSymbol = Symbol('OrderLineUpdated');

export class OrderLineUpdatedEvent {
  readonly orderId: UUID;
  readonly orderLineId: UUID;
  readonly newStatus: OrderLineStatus;
  readonly oldStatus: OrderLineStatus;

  constructor({
    newStatus,
    oldStatus,
    orderId,
    orderLineId,
  }: {
    orderId: UUID;
    orderLineId: UUID;
    newStatus: OrderLineStatus;
    oldStatus: OrderLineStatus;
  }) {
    this.newStatus = newStatus;
    this.oldStatus = oldStatus;
    this.orderId = orderId;
    this.orderLineId = orderLineId;
  }
}
