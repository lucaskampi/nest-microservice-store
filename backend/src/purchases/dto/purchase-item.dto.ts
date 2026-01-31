import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class PurchaseItemDTO {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsInt()
  @IsPositive()
  id!: number

  @ApiProperty({ example: 2, description: 'Quantity' })
  @IsInt()
  @IsPositive()
  amount!: number
}
