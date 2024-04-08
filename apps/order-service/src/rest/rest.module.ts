import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderMapperService } from './order-mapper.service';
import { ServicesModule } from '../service/services.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpEntityNotFoundExceptionFilter } from './entity-not-found-exception.filter';

@Module({
  imports: [ServicesModule],
  controllers: [OrderController],
  providers: [
    OrderMapperService,
    {
      provide: APP_FILTER,
      useClass: HttpEntityNotFoundExceptionFilter,
    },
  ],
})
export class RestModule {}
