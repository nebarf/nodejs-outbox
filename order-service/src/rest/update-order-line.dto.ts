import { IsEnum } from 'class-validator';
import { OrderLineStatus } from 'src/model/order-line.entity';

export class UpdateOrderLineDto {
  @IsEnum(OrderLineStatus)
  newStatus: OrderLineStatus;
}
