import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ServicesModule } from 'src/service/services.module';
import { OrderMapperService } from './order-mapper.service';

@Module({
  imports: [ServicesModule],
  controllers: [OrderController],
  providers: [OrderMapperService],
})
export class RestModule {}
