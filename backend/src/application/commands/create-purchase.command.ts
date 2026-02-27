import { CreatePurchaseDto } from '../dtos/create-purchase.dto';

export class CreatePurchaseCommand {
  constructor(
    public readonly dto: CreatePurchaseDto,
  ) {}
}
