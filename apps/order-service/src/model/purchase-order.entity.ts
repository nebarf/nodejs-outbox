import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { OrderLine, OrderLineStatus } from './order-line.entity';
import { EntityNotFoundException } from '../errors/entity-not-found';

@Entity()
export class PurchaseOrder {
  @PrimaryKey()
  id!: number;

  @Property()
  customerId!: number;

  @Property()
  orderDate = new Date();

  @OneToMany(() => OrderLine, 'order')
  lineItems = new Collection<OrderLine>(this);

  updateLineItemStatus(lineItemId: number, newStatus: OrderLineStatus) {
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
