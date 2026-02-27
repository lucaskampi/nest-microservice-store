import { CreatePurchaseCommand } from './create-purchase.command';
import { Purchase, Address, IPurchaseRepository } from '../../domain';
import { NotFoundException } from '@nestjs/common';

export class CreatePurchaseHandler {
  constructor(private readonly purchaseRepository: IPurchaseRepository) {}

  async execute(command: CreatePurchaseCommand): Promise<Purchase> {
    const address = Address.fromDto(command.dto.address);

    const purchase = Purchase.create({
      destinationAddress: address,
    });

    return this.purchaseRepository.save(purchase);
  }
}
