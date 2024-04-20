import { validateSync } from 'class-validator';
import { EventType } from './event-type';
import { ExportedEvent } from './exported-event';
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { serialize } from 'node:v8';

export type ParseResult<T extends EventType, R extends ExportedEvent<T>> =
  | { _tag: 'success'; instance: R }
  | { _tag: 'failure'; error: string };

export type ParseResultSuccess<
  T extends EventType,
  R extends ExportedEvent<T>,
> = Extract<ParseResult<T, R>, { _tag: 'success' }>;
export type ParseResultFailure<
  T extends EventType,
  R extends ExportedEvent<T>,
> = Extract<ParseResult<T, R>, { _tag: 'failure' }>;

export class ExportedEventCodec {
  toPlain<T extends EventType>(event: ExportedEvent<T>) {
    return instanceToPlain(event);
  }

  toBuffer<T extends EventType>(event: ExportedEvent<T>) {
    return serialize(this.toPlain(event));
  }

  toString<T extends EventType>(event: ExportedEvent<T>) {
    return this.toBuffer(event).toString();
  }

  parse<T extends EventType, R extends ExportedEvent<T>>(
    event: unknown,
    ctor: ClassConstructor<R>,
  ): ParseResult<T, R> {
    const instance = plainToInstance(ctor, event);

    const validationErrors = validateSync(instance);
    if (validationErrors.length > 0) {
      return { _tag: 'failure', error: validationErrors.toString() };
    }

    return { _tag: 'success', instance };
  }

  isParseSuccess<T extends EventType, R extends ExportedEvent<T>>(
    result: ParseResult<T, R>,
  ): result is ParseResultSuccess<T, R> {
    return result._tag === 'success';
  }

  isParseFailure<T extends EventType, R extends ExportedEvent<T>>(
    result: ParseResult<T, R>,
  ): result is ParseResultFailure<T, R> {
    return result._tag === 'failure';
  }

  serialize<T extends EventType>(event: ExportedEvent<T>) {
    return this.toString(event);
  }
}
