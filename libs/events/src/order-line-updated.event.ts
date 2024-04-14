import { IsEnum, IsString } from 'class-validator';
import { EventType } from './event-type';
import { exportedEventBaseline } from './exported-event';
import { OrderLineStatus } from './order-line-status';

export class OrderLineUpdatedExportedEvent extends exportedEventBaseline(
  EventType.OrderLineUpdated,
) {
  @IsString()
  readonly orderId: string;

  @IsString()
  readonly orderLineId: string;

  @IsEnum(OrderLineStatus)
  readonly newStatus: OrderLineStatus;

  @IsEnum(OrderLineStatus)
  readonly oldStatus: OrderLineStatus;

  constructor(
    orderId: string,
    orderLineId: string,
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
    orderId: string;
    orderLineId: string;
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
