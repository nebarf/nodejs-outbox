import { Injectable } from '@nestjs/common';
import { CreateOrderRequestDto } from './create-order-request.dto';
import { PurchaseOrder } from 'src/model/purchase-order.entity';
import {
  OrderLineItemResponseDto,
  OrderResponseDto,
} from './order-response.dto';
import { OrderLine, OrderLineStatus } from 'src/model/order-line.entity';

@Injectable()
export class OrderMapperService {
  fromCreateRequest(reqDto: CreateOrderRequestDto): PurchaseOrder {
    const lineItems = reqDto.lineItems.map((item) => {
      const orderLine = new OrderLine();

      orderLine.item = item.item;
      orderLine.quantity = item.quantity;
      orderLine.totalPrice = item.totalPrice;
      orderLine.status = OrderLineStatus.Entered;

      return orderLine;
    });

    const purchaseOrder = new PurchaseOrder();

    purchaseOrder.customerId = reqDto.customerId;
    purchaseOrder.orderDate = new Date(reqDto.orderDate);
    purchaseOrder.lineItems.set(lineItems);

    return purchaseOrder;
  }

  toResponse(order: PurchaseOrder): OrderResponseDto {
    const lineItems: OrderLineItemResponseDto[] = order.lineItems
      .toArray()
      .map((l) => {
        const lineItemDto: OrderLineItemResponseDto = {
          id: l.id,
          item: l.item,
          quantity: l.quantity,
          status: l.status,
          totalPrice: l.totalPrice,
        };

        return lineItemDto;
      });

    const { customerId, id, orderDate } = order;

    const responseDto: OrderResponseDto = {
      customerId,
      id,
      orderDate,
      lineItems,
    };

    return responseDto;
  }
}
