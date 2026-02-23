import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { VoucherDTO } from '../purchases/dto/voucher.dto'
import { InfoDeliveryDTO } from '../purchases/dto/info-delivery.dto'
import { CircuitBreakerService } from '../circuit-breaker/circuit-breaker.service'

@Injectable()
export class CarrierClient {
  private readonly logger = new Logger(CarrierClient.name)
  private readonly baseUrl: string
  private readonly circuitBreaker: CircuitBreakerService

  constructor(
    private readonly httpService: HttpService,
    private readonly globalCircuitBreaker: CircuitBreakerService,
  ) {
    this.baseUrl = process.env.CARRIER_SERVICE_URL || 'http://localhost:4002/api'
    this.circuitBreaker = new CircuitBreakerService()
  }

  async bookDelivery(deliveryInfo: InfoDeliveryDTO): Promise<VoucherDTO> {
    return this.circuitBreaker.execute(async () => {
      try {
        this.logger.log(`Booking delivery for order: ${deliveryInfo.orderId}`)
        const response = await firstValueFrom(
          this.httpService.post<VoucherDTO>(`${this.baseUrl}/delivery`, deliveryInfo)
        )
        return response.data
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        this.logger.error(`Failed to book delivery: ${message}`)
        throw new Error('Carrier service unavailable')
      }
    })
  }
}
