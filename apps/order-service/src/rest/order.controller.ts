import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateOrderLineDto } from './update-order-line.dto';
import { OrderMapperService } from './order-mapper.service';
import { CreateOrderRequestDto } from './create-order-request.dto';
import { OrderService } from '../service/order.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderMapper: OrderMapperService,
  ) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderRequestDto) {
    const order = this.orderMapper.fromCreateRequest(createOrderDto);
    const persistedOrder = await this.orderService.addOrder(order);

    return this.orderMapper.toResponse(persistedOrder);
  }

  @Put('/:orderId/lines/:orderLineId')
  updateOrderLine(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('orderLineId', ParseIntPipe) orderLineId: number,
    @Body() updateOrderLineDto: UpdateOrderLineDto,
  ) {
    console.log(
      '[OrderController] updateOrderLine',
      orderId,
      orderLineId,
      updateOrderLineDto,
    );
  }
}
