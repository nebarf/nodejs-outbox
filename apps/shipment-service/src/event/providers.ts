import { Provider } from '@nestjs/common';
import { OrderCreatedEventHandler } from './order-created-event.handler';
import { OrderLineUpdatedEventHandler } from './order-line-updated-event.handler';
import { EventType } from '@libs/events';
import { Option, fromNullish } from '@libs/monads/option';
import { ExportedEventHandler } from './exported-event.handler';
import { ExportedEvent } from '@libs/events/exported-event';

export const ExportedEventHandlerResolverToken = Symbol(
  'ExportedEventHandlerResolver',
);

export type ExportedEventHandlerResolver = {
  resolve: (
    eventType: EventType,
  ) => Option<ExportedEventHandler<EventType, ExportedEvent<EventType>>>;
};

export const ExportedEventHandlerResolverProvider: Provider = {
  provide: ExportedEventHandlerResolverToken,
  useFactory: (
    orderCreatedEventHandler: OrderCreatedEventHandler,
    orderLineUpdatedEventHandler: OrderLineUpdatedEventHandler,
  ) => {
    const handlerMap = new Map<EventType, ExportedEventHandler<EventType>>([
      [EventType.OrderCreated, orderCreatedEventHandler],
      [EventType.OrderLineUpdated, orderLineUpdatedEventHandler],
    ]);

    return {
      resolve: (eventType: EventType) => fromNullish(handlerMap.get(eventType)),
    };
  },
  inject: [OrderCreatedEventHandler, OrderLineUpdatedEventHandler],
};
