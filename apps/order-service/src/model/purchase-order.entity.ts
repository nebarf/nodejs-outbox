import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { OrderLine, OrderLineStatus } from './order-line.entity';

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

    const oldStatus = lineItem.status;
    lineItem.status = newStatus;

    return oldStatus;
  }
}
