import { OrderLineStatus } from '../model/order-line.entity';

export interface OrderLineItemResponseDto {
  id: string;
  item: string;
  quantity: number;
  totalPrice: number;
  status: OrderLineStatus;
}

export interface OrderResponseDto {
  id: string;
  customerId: number;
  orderDate: Date;
  lineItems: OrderLineItemResponseDto[];
}
