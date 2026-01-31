import { Module } from '@nestjs/common'
import { PurchasesController } from './purchases.controller'
import { PurchasesService } from './purchases.service'
import { PrismaService } from '../prisma/prisma.service'
import { HttpClientsModule } from '../http-clients/http-clients.module'

@Module({
  imports: [HttpClientsModule],
  controllers: [PurchasesController],
  providers: [PurchasesService, PrismaService],
})
export class PurchasesModule {}
