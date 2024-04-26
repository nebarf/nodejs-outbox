import { validateSync } from 'class-validator';
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { EventType } from './event-type';
import { ExportedEvent } from './exported-event';
import { Result, failure, success } from '@libs/monads';

export class ExportedEventCodec {
  parse<T extends EventType, R extends ExportedEvent<T>>(
    event: Record<string, unknown>,
    ctor: ClassConstructor<R>,
  ): Result<R, Error> {
    const instance = plainToInstance(ctor, event);

    const validationErrors = validateSync(instance);
    if (validationErrors.length > 0) {
      return failure(new Error(validationErrors.toString()));
    }

    return success(instance);
  }

  serialize<T extends EventType>(event: ExportedEvent<T>) {
    return this.toString(event);
  }

  toString<T extends EventType>(event: ExportedEvent<T>) {
    const plain = instanceToPlain(event);
    return JSON.stringify(plain);
  }

  toPlain<T extends EventType>(event: ExportedEvent<T>) {
    return instanceToPlain(event);
  }
}
