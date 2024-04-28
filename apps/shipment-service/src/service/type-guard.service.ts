import { Injectable } from '@nestjs/common';
import * as clv from 'class-validator';
import { UUID } from 'crypto';

@Injectable()
export class TypeGuardService {
  isUUID(value: unknown): value is UUID {
    return clv.isUUID(value);
  }

  isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && !Array.isArray(value) && typeof value === 'object';
  }

  isEnum<T extends Record<string, string | number>>(entity: T) {
    return (value: unknown): value is T[keyof T] => clv.isEnum(value, entity);
  }
}
