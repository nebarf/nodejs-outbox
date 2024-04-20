import { IsEnum, IsString } from 'class-validator';
import { EventType } from './event-type';
import { exportedEventBaseline } from './exported-event';
import { OrderLineStatus } from './order-line-status';
import { UUID } from 'crypto';

export class OrderLineUpdatedExportedEvent extends exportedEventBaseline(
  EventType.OrderLineUpdated,
) {
  @IsString()
  readonly orderId: UUID;

  @IsString()
  readonly orderLineId: UUID;

  @IsEnum(OrderLineStatus)
  readonly newStatus: OrderLineStatus;

  @IsEnum(OrderLineStatus)
  readonly oldStatus: OrderLineStatus;

  constructor(
    orderId: UUID,
    orderLineId: UUID,
    newStatus: OrderLineStatus,
    oldStatus: OrderLineStatus,
  ) {
    super(EventType.OrderLineUpdated);

    this.orderId = orderId;
    this.orderLineId = orderLineId;
    this.newStatus = newStatus;
    this.oldStatus = oldStatus;
  }

  static of({
    orderId,
    orderLineId,
    newStatus,
    oldStatus,
  }: {
    orderId: UUID;
    orderLineId: UUID;
    newStatus: OrderLineStatus;
    oldStatus: OrderLineStatus;
  }) {
    return new OrderLineUpdatedExportedEvent(
      orderId,
      orderLineId,
      newStatus,
      oldStatus,
    );
  }
}
