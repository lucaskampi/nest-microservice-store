import { ApiProperty } from '@nestjs/swagger'
import { IsArray, ValidateNested, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { PurchaseItemDTO } from './purchase-item.dto'
import { AddressDTO } from './address.dto'

export class CreatePurchaseDTO {
  @ApiProperty({ type: [PurchaseItemDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDTO)
  items!: PurchaseItemDTO[]

  @ApiProperty({ type: AddressDTO })
  @ValidateNested()
  @Type(() => AddressDTO)
  @IsNotEmpty()
  address!: AddressDTO
}
