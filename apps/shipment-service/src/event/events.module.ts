import { Module } from '@nestjs/common';
import { RabbitMqConsumerService } from './rabbitmq-consumer.service';
import { ServicesModule } from '../service/services.module';
import { ConfigModule } from '../config/config.module';
import { ExportedEventsModule } from '@libs/events';

@Module({
  imports: [ServicesModule, ConfigModule, ExportedEventsModule],
  providers: [RabbitMqConsumerService],
})
export class EventsModule {}
