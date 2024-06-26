import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Shipment {
  @PrimaryKey()
  id = crypto.randomUUID();

  @Property()
  customerId!: number;

  @Property()
  orderId!: string;

  @Property()
  orderDate!: Date;
}
