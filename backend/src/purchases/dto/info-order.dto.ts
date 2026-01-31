import { ApiProperty } from '@nestjs/swagger'

export class InfoOrderDTO {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 3, description: 'Preparation time in days' })
  preparationTime!: number
}
