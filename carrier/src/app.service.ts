import { Injectable } from '@nestjs/common'

interface DeliveryInfo {
  orderId: number
  deliveryDate: Date
  originAddress: string
  destinationAddress: string
}

@Injectable()
export class AppService {
  bookDelivery(deliveryInfo: DeliveryInfo) {
    // Mock delivery booking
    const voucherNumber = Math.floor(Math.random() * 100000) + 10000
    
    // Calculate delivery forecast (add 1-2 days to requested date)
    const deliveryForecast = new Date(deliveryInfo.deliveryDate)
    deliveryForecast.setDate(deliveryForecast.getDate() + Math.floor(Math.random() * 2) + 1)
    
    return {
      number: voucherNumber,
      deliveryForecast
    }
  }
}
