import { ApiProperty } from '@nestjs/swagger'

export class InfoDeliveryDTO {
  @ApiProperty({ example: 1 })
  orderId!: number

  @ApiProperty({ example: '2026-02-03T00:00:00.000Z' })
  deliveryDate!: Date

  @ApiProperty({ example: '456 Supplier Ave, SP' })
  originAddress!: string

  @ApiProperty({ example: '123 Main St, 123, SP' })
  destinationAddress!: string
}
