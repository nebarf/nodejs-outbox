import { IsEnum } from 'class-validator';
import { OrderLineStatus } from '../model/order-line.entity';

export class UpdateOrderLineDto {
  @IsEnum(OrderLineStatus)
  newStatus: OrderLineStatus;
}
