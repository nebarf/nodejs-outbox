import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { UUID } from 'crypto';

@Entity()
export class ConsumedMessage {
  @PrimaryKey()
  eventId!: UUID;

  @Property()
  timeOfReceiving = new Date();
}
