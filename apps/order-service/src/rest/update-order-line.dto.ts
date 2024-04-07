import { IsEnum, IsUUID } from 'class-validator';
import { UUID } from 'node:crypto';
import { OrderLineStatus } from '../model/order-line.entity';

export class UpdateOrderLineParamsDto {
  @IsUUID('4')
  orderId: UUID;
  @IsUUID('4')
  orderLineId: UUID;
}

export class UpdateOrderLineDto {
  @IsEnum(OrderLineStatus)
  newStatus: OrderLineStatus;
}
