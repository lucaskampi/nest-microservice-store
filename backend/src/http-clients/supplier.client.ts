import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { InfoProviderDTO } from '../purchases/dto/info-provider.dto'
import { InfoOrderDTO } from '../purchases/dto/info-order.dto'
import { PurchaseItemDTO } from '../purchases/dto/purchase-item.dto'

@Injectable()
export class SupplierClient {
  private readonly logger = new Logger(SupplierClient.name)
  private readonly baseUrl: string

  constructor(private readonly httpService: HttpService) {
    // In production, this would come from config or service discovery
    this.baseUrl = process.env.SUPPLIER_SERVICE_URL || 'http://localhost:4001/api'
  }

  async getInfoProviderByState(state: string): Promise<InfoProviderDTO> {
    try {
      this.logger.log(`Fetching provider info for state: ${state}`)
      const response = await firstValueFrom(
        this.httpService.get<InfoProviderDTO>(`${this.baseUrl}/info/${state}`)
      )
      return response.data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Failed to get provider info: ${message}`)
      throw new Error('Supplier service unavailable')
    }
  }

  async placeOrder(items: PurchaseItemDTO[]): Promise<InfoOrderDTO> {
    try {
      this.logger.log('Placing order with supplier')
      const response = await firstValueFrom(
        this.httpService.post<InfoOrderDTO>(`${this.baseUrl}/order`, items)
      )
      return response.data
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Failed to place order: ${message}`)
      throw new Error('Failed to place order with supplier')
    }
  }
}
