import {
  EventType,
  ExportedEventCodecService,
  OrderLineUpdatedExportedEvent,
} from '@libs/events';
import { ExportedEventHandler } from './exported-event.handler';
import { Result } from '@libs/monads';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OrderLineUpdatedEventHandler extends ExportedEventHandler<EventType.OrderLineUpdated> {
  private readonly logger = new Logger('OrderLineUpdatedEventHandler');

  constructor(private readonly exportedEventCodec: ExportedEventCodecService) {
    super();
  }

  parse(
    plain: Record<string, unknown>,
  ): Result<OrderLineUpdatedExportedEvent, Error> {
    return this.exportedEventCodec.parse(plain, OrderLineUpdatedExportedEvent);
  }

  handle(event: OrderLineUpdatedExportedEvent): void {
    this.logger.warn(`Processing of ${event.eventType} not yet implemented`);
  }
}
