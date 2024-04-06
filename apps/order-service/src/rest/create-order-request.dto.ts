import {
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateOrderLineItemRequestDto {
  @IsString()
  item: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  totalPrice: number;
}

export class CreateOrderRequestDto {
  @IsNumber()
  customerId: number;

  @IsDateString()
  orderDate: string;

  @ValidateNested()
  lineItems: CreateOrderLineItemRequestDto[];
}
