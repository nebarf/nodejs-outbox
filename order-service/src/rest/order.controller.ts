import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateOrderDto } from './create-order.dto';
import { UpdateOrderLineDto } from './update-order-line.dto';

@Controller('orders')
export class OrderController {
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    console.log('[OrderController] createOrder', createOrderDto);
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
