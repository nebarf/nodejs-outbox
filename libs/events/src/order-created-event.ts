import { IsDate, IsNumber, IsString } from 'class-validator';
import { EventType } from './event-type';
import { exportedEventBaseline } from './exported-event';

export class OrderCreatedExportedEvent extends exportedEventBaseline(
  EventType.OrderCreated,
) {
  @IsString()
  readonly id: string;

  @IsNumber()
  readonly customerId: number;

  @IsDate()
  readonly orderDate: Date;

  constructor(id: string, customerId: number, orderDate: Date) {
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
    id: string;
    customerId: number;
    orderDate: Date;
  }) {
    return new OrderCreatedExportedEvent(id, customerId, orderDate);
  }
}
