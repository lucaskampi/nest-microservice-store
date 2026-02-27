import { Purchase, PurchaseState, Address } from '../../../domain';

interface PrismaPurchaseRaw {
  id: number;
  orderId: number | null;
  preparationTime: number | null;
  destinationAddress: string;
  deliveryDate: Date | null;
  voucher: number | null;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PurchaseMapper {
  static toDomain(prismaPurchase: PrismaPurchaseRaw): Purchase {
    const parts = prismaPurchase.destinationAddress.split(', ');
    const street = parts[0] || '';
    const numberStr = parts[1] || '0';
    const state = parts[2] || '';

    return Purchase.fromPersistence({
      id: prismaPurchase.id,
      destinationAddress: Address.create({
        street,
        number: parseInt(numberStr, 10),
        state,
      }),
      state: prismaPurchase.state as PurchaseState,
      orderId: prismaPurchase.orderId ? String(prismaPurchase.orderId) : null,
      preparationTime: prismaPurchase.preparationTime,
      deliveryDate: prismaPurchase.deliveryDate,
      voucher: prismaPurchase.voucher ? String(prismaPurchase.voucher) : null,
      createdAt: prismaPurchase.createdAt,
      updatedAt: prismaPurchase.updatedAt,
    });
  }

  static toPrismaCreate(purchase: Purchase): Omit<PrismaPurchaseRaw, 'id' | 'createdAt' | 'updatedAt'> {
    const plain = purchase.toPlainObject();
    return {
      destinationAddress: plain.destinationAddress,
      state: plain.state,
      orderId: plain.orderId ? parseInt(plain.orderId, 10) : null,
      preparationTime: plain.preparationTime,
      deliveryDate: plain.deliveryDate || null,
      voucher: plain.voucher ? parseInt(plain.voucher, 10) : null,
    };
  }

  static toPrismaUpdate(purchase: Purchase): Omit<PrismaPurchaseRaw, 'id' | 'createdAt'> {
    const plain = purchase.toPlainObject();
    return {
      destinationAddress: plain.destinationAddress,
      state: plain.state,
      orderId: plain.orderId ? parseInt(plain.orderId, 10) : null,
      preparationTime: plain.preparationTime,
      deliveryDate: plain.deliveryDate || null,
      voucher: plain.voucher ? parseInt(plain.voucher, 10) : null,
      updatedAt: plain.updatedAt,
    };
  }
}
