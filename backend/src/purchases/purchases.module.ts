import { Module } from '@nestjs/common';
import { IPurchaseRepository } from '../../domain';
import { PrismaPurchaseRepository } from '../../infrastructure/persistence/repositories/prisma-purchase.repository';
import { CreatePurchaseHandler, GetPurchaseByIdHandler, GetAllPurchasesHandler } from '../../application';
import { PurchasesController } from '../../presentation/controllers/purchases.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PurchasesController],
  providers: [
    {
      provide: IPurchaseRepository,
      useClass: PrismaPurchaseRepository,
    },
    CreatePurchaseHandler,
    GetPurchaseByIdHandler,
    GetAllPurchasesHandler,
  ],
  exports: [IPurchaseRepository],
})
export class PurchasesModule {}
