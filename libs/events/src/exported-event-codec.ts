import { validateSync } from 'class-validator';
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { EventType } from './event-type';
import { ExportedEvent } from './exported-event';

export type ParseResult<
  T extends EventType,
  R extends ExportedEvent<T>,
  E extends Error = Error,
> = { _tag: 'success'; instance: R } | { _tag: 'failure'; error: E };

export type ParseResultSuccess<
  T extends EventType,
  R extends ExportedEvent<T>,
> = Extract<ParseResult<T, R>, { _tag: 'success' }>;

export type ParseResultFailure<
  T extends EventType,
  R extends ExportedEvent<T>,
> = Extract<ParseResult<T, R>, { _tag: 'failure' }>;

export class ExportedEventCodec {
  parse<T extends EventType, R extends ExportedEvent<T>>(
    event: Record<string, unknown> | string,
    ctor: ClassConstructor<R>,
  ): ParseResult<T, R> {
    let plain: Record<string, unknown>;
    if (typeof event === 'string') {
      try {
        plain = JSON.parse(event);
      } catch (err) {
        return {
          _tag: 'failure' as const,
          error: new Error('Failed to parse event from string'),
        };
      }
    } else {
      plain = event;
    }

    const instance = plainToInstance(ctor, plain);

    const validationErrors = validateSync(instance);
    if (validationErrors.length > 0) {
      return { _tag: 'failure', error: new Error(validationErrors.toString()) };
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

  toString<T extends EventType>(event: ExportedEvent<T>) {
    const plain = instanceToPlain(event);
    return JSON.stringify(plain);
  }

  toPlain<T extends EventType>(event: ExportedEvent<T>) {
    return instanceToPlain(event);
  }
}
