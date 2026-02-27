import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ISupplierPort, ProviderInfo, OrderInfo } from '../../../domain';
import { CircuitBreakerService } from '../../../circuit-breaker/circuit-breaker.service';

@Injectable()
export class SupplierAdapter implements ISupplierPort {
  private readonly logger = new Logger(SupplierAdapter.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {
    this.baseUrl = process.env.SUPPLIER_SERVICE_URL || 'http://localhost:4001/api';
  }

  async getInfoProviderByState(state: string): Promise<ProviderInfo> {
    return this.circuitBreaker.execute(async () => {
      try {
        this.logger.log(`Fetching provider info for state: ${state}`);
        const response = await firstValueFrom(
          this.httpService.get<ProviderInfo>(`${this.baseUrl}/info/${state}`),
        );
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to get provider info: ${message}`);
        throw new Error('Supplier service unavailable');
      }
    });
  }

  async placeOrder(items: Array<{ id: number; amount: number }>): Promise<OrderInfo> {
    return this.circuitBreaker.execute(async () => {
      try {
        this.logger.log('Placing order with supplier');
        const response = await firstValueFrom(
          this.httpService.post<OrderInfo>(`${this.baseUrl}/order`, items),
        );
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to place order: ${message}`);
        throw new Error('Failed to place order with supplier');
      }
    });
  }
}
