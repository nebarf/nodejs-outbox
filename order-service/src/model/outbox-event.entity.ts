import { Entity, JsonType, PrimaryKey, Property } from '@mikro-orm/core';
import * as crypto from 'node:crypto';

@Entity()
export class OutboxEvent {
  @PrimaryKey({ type: 'uuid' })
  id = crypto.randomUUID();

  @Property()
  aggregateType!: string;

  @Property()
  aggregateId!: string;

  @Property({ type: JsonType })
  payload!: Record<string, unknown>;

  @Property()
  type!: string;

  @Property()
  timestamp = new Date();
}
