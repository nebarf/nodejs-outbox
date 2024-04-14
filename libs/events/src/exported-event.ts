import { EventType } from './event-type';

export abstract class ExportedEvent<T extends EventType> {
  readonly eventType: T;

  constructor(eventType: T) {
    this.eventType = eventType;
  }
}
