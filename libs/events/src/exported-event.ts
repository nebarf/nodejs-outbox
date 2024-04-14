import { Equals } from 'class-validator';
import { EventType } from './event-type';

export abstract class ExportedEvent<T extends EventType> {
  abstract readonly eventType: T;
}

export function exportedEventBaseline<T extends EventType>(eventType: T) {
  abstract class ExportedEventBaseline extends ExportedEvent<T> {
    @Equals(eventType)
    readonly eventType: T;

    constructor(eventType: T) {
      super();
      this.eventType = eventType;
    }
  }

  return ExportedEventBaseline;
}
