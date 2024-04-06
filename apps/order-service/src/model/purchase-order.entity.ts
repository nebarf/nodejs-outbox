import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { OrderLine } from './order-line.entity';

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
}
