import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderMapperService } from './order-mapper.service';
import { ServicesModule } from '../service/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [OrderController],
  providers: [OrderMapperService],
})
export class RestModule {}
