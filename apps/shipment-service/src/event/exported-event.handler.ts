import { EventType } from '@libs/events';
import { ExportedEvent } from '@libs/events/exported-event';
import { Result } from '@libs/monads';

export abstract class ExportedEventHandler<
  U extends EventType,
  T extends ExportedEvent<U> = ExportedEvent<U>,
> {
  abstract parse(plainEvent: Record<string, unknown>): Result<T, Error>;
  abstract handle(event: T): void;

  handlePlain(plainEvent: Record<string, unknown>): Result<void, Error> {
    return this.parse(plainEvent).map(this.handle.bind(this));
  }
}
