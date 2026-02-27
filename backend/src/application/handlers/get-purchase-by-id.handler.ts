import { GetPurchaseByIdQuery } from '../queries/get-purchase-by-id.query';
import { Purchase, IPurchaseRepository } from '../../domain';
import { NotFoundException } from '@nestjs/common';

export class GetPurchaseByIdHandler {
  constructor(private readonly purchaseRepository: IPurchaseRepository) {}

  async execute(query: GetPurchaseByIdQuery): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(query.id);
    
    if (!purchase) {
      throw new NotFoundException(`Purchase with ID ${query.id} not found`);
    }
    
    return purchase;
  }
}
