import { validateSync } from 'class-validator';
import { EventType } from './event-type';
import { ExportedEvent } from './exported-event';
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { serialize } from 'node:v8';

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

  parse<T extends EventType>(
    event: unknown,
    ctor: ClassConstructor<ExportedEvent<T>>,
  ) {
    const instance = plainToInstance(ctor, event);

    const validationErrors = validateSync(instance);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.toString());
    }

    return instance;
  }

  serialize<T extends EventType>(event: ExportedEvent<T>) {
    return this.toString(event);
  }
}
