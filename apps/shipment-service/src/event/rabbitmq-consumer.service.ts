import {
  ExportedEventCodecService,
  OrderCreatedExportedEvent,
  OrderLineUpdatedExportedEvent,
  EventType,
} from '@libs/events';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ChannelWrapper, connect } from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage, credentials } from 'amqplib';
import { CreateRequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { isUUID } from 'class-validator';
import { MessageLogService } from '../service/message-log.service';
import { ShipmentService } from '../service/shipment.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class RabbitMqConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly channel: ChannelWrapper;
  private readonly logger = new Logger('RabbitMqConsumerService');

  constructor(
    private readonly exportedEventCodec: ExportedEventCodecService,
    private readonly shipmentService: ShipmentService,
    private readonly messageLog: MessageLogService,
    private readonly entityManager: EntityManager,
    private readonly config: ConfigService,
  ) {
    const connectionManager = connect(this.config.rabbit.host, {
      connectionOptions: {
        credentials: credentials.plain(
          this.config.rabbit.user,
          this.config.rabbit.password,
        ),
      },
    });
    const orderQueue = this.config.rabbit.orderQueue;

    this.channel = connectionManager.createChannel({
      setup: function (channel: ConfirmChannel) {
        return channel.assertQueue(orderQueue, { durable: true });
      },
    });
  }

  async onModuleInit() {
    return this.channel.consume(
      this.config.rabbit.orderQueue,
      this.handleMessage.bind(this),
    );
  }

  async onModuleDestroy() {
    return this.channel.close();
  }

  @CreateRequestContext()
  async handleMessage(message: ConsumeMessage) {
    const eventType = message.properties.headers?.eventType;
    const eventId = message.properties.headers?.id;

    if (
      eventType !== EventType.OrderCreated &&
      eventType !== EventType.OrderLineUpdated
    ) {
      this.logger.warn(`Unknown event type ${eventType}`);
      return;
    }

    if (isUUID(eventId, '4') === false) {
      this.logger.error(
        new Error(
          `Expected event id to be of type UUID, got ${eventId} instead`,
        ),
      );
      return;
    }

    const wasEventAlreadyProcessed =
      await this.messageLog.wasAlreadyProcessed(eventId);
    if (wasEventAlreadyProcessed) {
      this.logger.warn(
        `Event with ${eventId} was already processed, skipping it`,
      );
      this.channel.ack(message);
      return;
    }

    const payload = message.content.toString();

    if (eventType === EventType.OrderCreated) {
      const parsedPayloadResult = this.exportedEventCodec.parse(
        payload,
        OrderCreatedExportedEvent,
      );

      if (this.exportedEventCodec.isParseFailure(parsedPayloadResult)) {
        this.logger.error(parsedPayloadResult.error);
        return;
      }
      this.shipmentService.orderCreated(parsedPayloadResult.instance);
    }

    if (eventType === EventType.OrderLineUpdated) {
      const parsedPayloadResult = this.exportedEventCodec.parse(
        payload,
        OrderLineUpdatedExportedEvent,
      );
      if (this.exportedEventCodec.isParseFailure(parsedPayloadResult)) {
        this.logger.error(parsedPayloadResult.error);
        return;
      }
      this.shipmentService.orderLineUpdated(parsedPayloadResult.instance);
    }

    this.messageLog.markAsProcessed(eventId);
    await this.entityManager.flush();
  }
}
