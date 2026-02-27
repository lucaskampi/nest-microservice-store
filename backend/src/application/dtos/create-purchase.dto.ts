import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseItemDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;
}

export class AddressDto {
  @IsNotEmpty()
  street!: string;

  @IsNumber()
  @IsNotEmpty()
  number!: number;

  @IsNotEmpty()
  state!: string;
}

export class CreatePurchaseDto {
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  @IsNotEmpty()
  items!: PurchaseItemDto[];

  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  address!: AddressDto;
}
