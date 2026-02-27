import { GetAllPurchasesQuery } from '../queries/get-all-purchases.query';
import { Purchase, IPurchaseRepository } from '../../domain';

export class GetAllPurchasesHandler {
  constructor(private readonly purchaseRepository: IPurchaseRepository) {}

  async execute(_query: GetAllPurchasesQuery): Promise<Purchase[]> {
    return this.purchaseRepository.findAll();
  }
}
