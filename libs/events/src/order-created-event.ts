import { IsNumber, IsUUID, IsISO8601 } from 'class-validator';
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

  @IsISO8601()
  readonly orderDate: string;

  constructor(id: UUID, customerId: number, orderDate: string) {
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
    orderDate: string;
  }) {
    return new OrderCreatedExportedEvent(id, customerId, orderDate);
  }
}
