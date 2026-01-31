import { ApiProperty } from '@nestjs/swagger'

export class InfoProviderDTO {
  @ApiProperty({ example: '456 Supplier Ave, SP' })
  address!: string
}
