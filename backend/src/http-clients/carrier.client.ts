import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { VoucherDTO } from '../purchases/dto/voucher.dto'
import { InfoDeliveryDTO } from '../purchases/dto/info-delivery.dto'

@Injectable()
export class CarrierClient {
  private readonly logger = new Logger(CarrierClient.name)
  private readonly baseUrl: string

  constructor(private readonly httpService: HttpService) {
    // In production, this would come from config or service discovery
    this.baseUrl = process.env.CARRIER_SERVICE_URL || 'http://localhost:4002/api'
  }

  async bookDelivery(infoDelivery: InfoDeliveryDTO): Promise<VoucherDTO> {
    try {
      this.logger.log('Booking delivery with carrier')
      const response = await firstValueFrom(
        this.httpService.post<VoucherDTO>(`${this.baseUrl}/delivery`, infoDelivery)
      )
      return response.data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Failed to book delivery: ${message}`)
      throw new Error('Carrier service unavailable')
    }
  }
}
