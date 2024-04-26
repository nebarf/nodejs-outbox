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
import {
  ConfirmChannel,
  ConsumeMessage,
  MessagePropertyHeaders,
  credentials,
} from 'amqplib';
import { CreateRequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { isEnum, isUUID } from 'class-validator';
import { MessageLogService } from '../service/message-log.service';
import { ShipmentService } from '../service/shipment.service';
import { ConfigService } from '../config/config.service';
import { UUID } from 'node:crypto';
import { Result, failure, isFailure, success } from '@libs/monads';

@Injectable()
export class RabbitMqConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly channel: ChannelWrapper;
  private readonly logger = new Logger('RabbitMqConsumerService');

  constructor(
    private readonly exportedEventCodec: ExportedEventCodecService,
    private readonly shipmentService: ShipmentService,
    private readonly messageLog: MessageLogService,
    private readonly em: EntityManager,
    private readonly config: ConfigService,
  ) {
    const connectionManager = connect(`amqp://${this.config.rabbit.host}`, {
      connectionOptions: {
        port: this.config.rabbit.port,
        credentials: credentials.plain(
          this.config.rabbit.user,
          this.config.rabbit.password,
        ),
      },
    });
    this.channel = connectionManager.createChannel();
  }

  async onModuleInit() {
    try {
      await this.channel.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.config.rabbit.orderQueue, {
          durable: true,
        });

        await channel.consume(
          this.config.rabbit.orderQueue,
          this.handleMessage.bind(this),
        );

        this.logger.log('Consumer setup completed.');
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }

  async onModuleDestroy() {
    return this.channel.close();
  }

  @CreateRequestContext()
  async handleMessage(message: ConsumeMessage) {
    const eventMetaResult = this.getEventMeta(message.properties.headers);

    if (isFailure(eventMetaResult)) {
      this.logger.error(eventMetaResult.failure);
      return;
    }

    const { eventId, eventType } = eventMetaResult.value;

    const wasEventAlreadyProcessed =
      await this.messageLog.wasAlreadyProcessed(eventId);

    if (wasEventAlreadyProcessed) {
      this.logger.warn(
        `Event with ${eventId} was already processed, skipping it`,
      );
      this.channel.ack(message);
      return;
    }

    const payloadResult = this.getPayload(
      message.content.toString(),
      (v): v is Record<string, unknown> => typeof v === 'object',
    );

    if (isFailure(payloadResult)) {
      this.logger.error(payloadResult.failure);
      return;
    }

    if (eventType === EventType.OrderCreated) {
      const parsedPayloadResult = this.exportedEventCodec.parse(
        payloadResult.value,
        OrderCreatedExportedEvent,
      );

      if (isFailure(parsedPayloadResult)) {
        this.logger.error(parsedPayloadResult.failure);
        return;
      }
      this.shipmentService.orderCreated(parsedPayloadResult.value);
    }

    if (eventType === EventType.OrderLineUpdated) {
      const parsedPayloadResult = this.exportedEventCodec.parse(
        payloadResult.value,
        OrderLineUpdatedExportedEvent,
      );
      if (isFailure(parsedPayloadResult)) {
        this.logger.error(parsedPayloadResult.failure);
        return;
      }
      this.shipmentService.orderLineUpdated(parsedPayloadResult.value);
    }

    this.messageLog.markAsProcessed(eventId);
    await this.em.flush();

    this.channel.ack(message);
  }

  private getEventMeta(
    headers: MessagePropertyHeaders | undefined,
  ): Result<{ eventType: EventType; eventId: UUID }, Error> {
    const eventTypeResult = this.getPayload(
      headers?.eventType,
      (v): v is EventType => isEnum(v, EventType),
    );
    if (isFailure(eventTypeResult)) {
      return failure(eventTypeResult.failure);
    }

    const eventIdResult = this.getPayload(headers?.id, (v): v is UUID =>
      isUUID(v, '4'),
    );
    if (isFailure(eventIdResult)) {
      return failure(eventIdResult.failure);
    }

    const eventType = eventTypeResult.value;
    const eventId = eventIdResult.value;

    return success({ eventType, eventId });
  }

  private getPayload<T>(
    envelop: string,
    guard: (value: unknown) => value is T,
    key = 'payload',
  ): Result<T, Error> {
    let plainEnvelop;

    try {
      plainEnvelop = JSON.parse(envelop);
    } catch (err) {
      return failure(new Error(`Failed to parse envelop to plain object`));
    }

    if (key in plainEnvelop === false) {
      return failure(new Error(`Parsed envelop missing key ${key}`));
    }

    const payload = plainEnvelop[key];
    if (guard(payload) === false) {
      return failure(new Error('Payload does not match guard'));
    }

    return success(payload);
  }
}
