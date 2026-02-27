import { Injectable } from '@nestjs/common';
import { IPurchaseRepository } from '../../../domain';
import { Purchase } from '../../../domain';
import { PurchaseMapper } from '../mappers/purchase.mapper';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PrismaPurchaseRepository implements IPurchaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Purchase[]> {
    const purchases = await this.prisma.purchase.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return purchases.map(PurchaseMapper.toDomain);
  }

  async findById(id: number): Promise<Purchase | null> {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
    });
    return purchase ? PurchaseMapper.toDomain(purchase) : null;
  }

  async save(purchase: Purchase): Promise<Purchase> {
    const data = PurchaseMapper.toPrismaCreate(purchase);
    const created = await this.prisma.purchase.create({ data });
    return PurchaseMapper.toDomain(created);
  }

  async update(purchase: Purchase): Promise<Purchase> {
    const data = PurchaseMapper.toPrismaUpdate(purchase);
    const updated = await this.prisma.purchase.update({
      where: { id: purchase.id },
      data,
    });
    return PurchaseMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.purchase.delete({ where: { id } });
  }
}
