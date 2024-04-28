import { Module } from '@nestjs/common';
import { RabbitMqConsumerService } from './rabbitmq-consumer.service';
import { ServicesModule } from '../service/services.module';
import { ConfigModule } from '../config/config.module';
import { ExportedEventsModule } from '@libs/events';
import { ExportedEventHandlerResolverProvider } from './providers';
import { OrderCreatedEventHandler } from './order-created-event.handler';
import { OrderLineUpdatedEventHandler } from './order-line-updated-event.handler';

@Module({
  imports: [ServicesModule, ConfigModule, ExportedEventsModule],
  providers: [
    RabbitMqConsumerService,
    OrderCreatedEventHandler,
    OrderLineUpdatedEventHandler,
    ExportedEventHandlerResolverProvider,
  ],
})
export class EventsModule {}
