import { IsDate, IsNumber, IsUUID } from 'class-validator';
import { EventType } from './event-type';
import { exportedEventBaseline } from './exported-event';
import { UUID } from 'crypto';

export class OrderCreatedExportedEvent extends exportedEventBaseline(
  EventType.OrderCreated,
) {
  @IsUUID('4')
  readonly id: UUID;

  @IsNumber()
  readonly customerId: number;

  @IsDate()
  readonly orderDate: Date;

  constructor(id: UUID, customerId: number, orderDate: Date) {
    super(EventType.OrderCreated);

    this.id = id;
    this.customerId = customerId;
    this.orderDate = orderDate;
  }

  static of({
    id,
    customerId,
    orderDate,
  }: {
    id: UUID;
    customerId: number;
    orderDate: Date;
  }) {
    return new OrderCreatedExportedEvent(id, customerId, orderDate);
  }
}
