import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import * as crypto from 'node:crypto';
import { OrderLine, OrderLineStatus } from './order-line.entity';
import { EntityNotFoundException } from '../errors/entity-not-found';

@Entity()
export class PurchaseOrder {
  @PrimaryKey()
  id = crypto.randomUUID();

  @Property()
  customerId!: number;

  @Property()
  orderDate = new Date();

  @OneToMany(() => OrderLine, 'order')
  lineItems = new Collection<OrderLine>(this);

  updateLineItemStatus(lineItemId: string, newStatus: OrderLineStatus) {
    const lineItem = this.lineItems.find(
      (lineItem) => lineItem.id === lineItemId,
    );
    if (typeof lineItem === 'undefined' || lineItem === null) {
      throw new EntityNotFoundException(
        `Order line with id ${lineItemId} was not found`,
      );
    }

    const oldStatus = lineItem.status;
    lineItem.status = newStatus;

    return oldStatus;
  }
}
