import { OrderLineStatus } from '../model/order-line.entity';

export interface OrderLineItemResponseDto {
  id: number;
  item: string;
  quantity: number;
  totalPrice: number;
  status: OrderLineStatus;
}

export interface OrderResponseDto {
  id: number;
  customerId: number;
  orderDate: Date;
  lineItems: OrderLineItemResponseDto[];
}
