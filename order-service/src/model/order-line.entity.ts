import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { PurchaseOrder } from './purchase-order.entity';

@Entity()
export class OrderLine {
  @PrimaryKey()
  id!: number;

  @Property()
  quantity!: number;

  @Property()
  totalPrice!: number;

  @Property()
  item!: string;

  @Enum(() => OrderLineStatus)
  status!: OrderLineStatus;

  @ManyToOne(() => PurchaseOrder)
  order!: PurchaseOrder;
}

export enum OrderLineStatus {
  Entered = 'ENTERED',
  Cancelled = 'CANCELLED',
  Shipped = 'SHIPPED',
}
