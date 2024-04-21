import { Module } from '@nestjs/common';
import { RabbitMqConsumerService } from './rabbitmq-consumer.service';
import { ServicesModule } from '../service/services.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ServicesModule, ConfigModule],
  providers: [RabbitMqConsumerService],
})
export class EventsModule {}
