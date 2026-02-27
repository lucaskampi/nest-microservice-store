import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ICarrierPort, DeliveryInfo, VoucherInfo } from '../../../domain';
import { CircuitBreakerService } from '../../../circuit-breaker/circuit-breaker.service';

@Injectable()
export class CarrierAdapter implements ICarrierPort {
  private readonly logger = new Logger(CarrierAdapter.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {
    this.baseUrl = process.env.CARRIER_SERVICE_URL || 'http://localhost:4002/api';
  }

  async bookDelivery(info: DeliveryInfo): Promise<VoucherInfo> {
    return this.circuitBreaker.execute(async () => {
      try {
        this.logger.log(`Booking delivery for order: ${info.orderId}`);
        const response = await firstValueFrom(
          this.httpService.post<VoucherInfo>(`${this.baseUrl}/delivery`, {
            orderId: info.orderId,
            deliveryDate: info.deliveryDate,
            originAddress: info.originAddress,
            destinationAddress: info.destinationAddress,
          }),
        );
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to book delivery: ${message}`);
        throw new Error('Carrier service unavailable');
      }
    });
  }
}
