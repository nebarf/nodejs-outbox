import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import {
  UpdateOrderLineDto,
  UpdateOrderLineParamsDto,
} from './update-order-line.dto';
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
  async updateOrderLine(
    @Param() params: UpdateOrderLineParamsDto,
    @Body() updateOrderLineDto: UpdateOrderLineDto,
  ) {
    const order = await this.orderService.updateOrderLine({
      orderId: params.orderId,
      orderLineId: params.orderLineId,
      orderLineStatus: updateOrderLineDto.newStatus,
    });
    return this.orderMapper.toResponse(order);
  }
}
