import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { ConsumedMessage } from '../model/consumed-message.entity';

@Injectable()
export class MessageLogService {
  constructor(private readonly entityManager: EntityManager) {}

  markAsProcessed(eventId: UUID) {
    const message = new ConsumedMessage();
    message.eventId = eventId;

    this.entityManager.persist(message);
  }

  async wasAlreadyProcessed(eventId: UUID) {
    const message = await this.entityManager.findOne(ConsumedMessage, {
      eventId,
    });
    return !!message;
  }
}
