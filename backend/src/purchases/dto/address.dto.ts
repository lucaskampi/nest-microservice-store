import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsInt, IsNotEmpty } from 'class-validator'

export class AddressDTO {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  street!: string

  @ApiProperty({ example: 123 })
  @IsInt()
  number!: number

  @ApiProperty({ example: 'SP' })
  @IsString()
  @IsNotEmpty()
  state!: string
}
