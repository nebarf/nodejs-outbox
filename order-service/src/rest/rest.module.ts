import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ServicesModule } from 'src/service/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [OrderController],
})
export class RestModule {}
