import { ApiProperty } from '@nestjs/swagger'

export class VoucherDTO {
  @ApiProperty({ example: 12345 })
  number!: number

  @ApiProperty({ example: '2026-02-05T00:00:00.000Z' })
  deliveryForecast!: Date
}
