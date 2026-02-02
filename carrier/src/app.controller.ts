import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AppService } from './app.service'

@ApiTags('carrier')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('delivery')
  @ApiOperation({ summary: 'Book delivery with carrier' })
  @ApiResponse({ status: 201, description: 'Delivery booked successfully' })
  bookDelivery(@Body() deliveryInfo: {
    orderId: number
    deliveryDate: Date
    originAddress: string
    destinationAddress: string
  }) {
    return this.appService.bookDelivery(deliveryInfo)
  }
}
