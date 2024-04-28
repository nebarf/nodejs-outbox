import { EventType } from '@libs/events';
import {
  Inject,
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
import { MessageLogService } from '../service/message-log.service';
import { ConfigService } from '../config/config.service';
import { UUID } from 'node:crypto';
import { Result, isFailure, tryCatch } from '@libs/monads';
import { isNone } from '@libs/monads';
import {
  ExportedEventHandlerResolver,
  ExportedEventHandlerResolverToken,
} from './providers';
import { TypeGuardService } from '../service/type-guard.service';

@Injectable()
export class RabbitMqConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly channel: ChannelWrapper;
  private readonly logger = new Logger('RabbitMqConsumerService');

  constructor(
    private readonly messageLog: MessageLogService,
    private readonly em: EntityManager,
    private readonly config: ConfigService,
    private typeGuard: TypeGuardService,
    @Inject(ExportedEventHandlerResolverToken)
    private readonly exportedEventHandlerResolver: ExportedEventHandlerResolver,
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
      this.typeGuard.isRecord,
    );

    if (isFailure(payloadResult)) {
      this.logger.error(payloadResult.failure);
      return;
    }

    const handler = this.exportedEventHandlerResolver.resolve(eventType);
    if (isNone(handler)) {
      this.logger.error(new Error(`Missing handler for event ${eventType}`));
      return;
    }

    const result = handler.value.handlePlain(payloadResult.value);
    if (isFailure(result)) {
      this.logger.error(result.failure);
      return;
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
      this.typeGuard.isEnum(EventType),
    );

    const eventIdResult = this.getPayload(headers?.id, this.typeGuard.isUUID);

    const eventMetaResult = eventTypeResult.chain((eventType) =>
      eventIdResult.map((eventId) => ({
        eventId,
        eventType,
      })),
    );

    return eventMetaResult;
  }

  private getPayload<T>(
    envelop: string,
    guard: (value: unknown) => value is T,
    key = 'payload',
  ): Result<T, Error> {
    return tryCatch(
      () => JSON.parse(envelop),
      () => new Error(`Failed to parse envelop to plain object`),
    )
      .map((plainEnvelop) => plainEnvelop[key])
      .filterOrElse(guard, () => new Error('Payload does not match guard'));
  }
}
