import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePurchaseDTO } from './dto/create-purchase.dto'
import { Purchase } from './entities/purchase.entity'
import { SupplierClient } from '../http-clients/supplier.client'
import { CarrierClient } from '../http-clients/carrier.client'
import { InfoDeliveryDTO } from './dto/info-delivery.dto'

@Injectable()
export class PurchasesService {
  private readonly logger = new Logger(PurchasesService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly supplierClient: SupplierClient,
    private readonly carrierClient: CarrierClient,
  ) {}

  async findAll(): Promise<Purchase[]> {
    return this.prisma.purchase.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: number): Promise<Purchase> {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
    })

    if (!purchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`)
    }

    return purchase
  }

  async makePurchase(dto: CreatePurchaseDTO): Promise<Purchase> {
    const state = dto.address.state
    let purchaseId: number | undefined = undefined

    try {
      // Step 0 - Create purchase with RECEIVED state
      this.logger.log('Creating new purchase with RECEIVED state')
      const purchase = await this.prisma.purchase.create({
        data: {
          destinationAddress: `${dto.address.street}, ${dto.address.number}, ${dto.address.state}`,
          state: 'RECEIVED',
        },
      })
      purchaseId = purchase.id

      // Step 1 - Get provider information by state
      this.logger.log(`Fetching provider information for state: ${state}`)
      const providerInfo = await this.supplierClient.getInfoProviderByState(state)

      // Step 2 - Place order with supplier
      this.logger.log('Placing order with supplier')
      const orderInfo = await this.supplierClient.placeOrder(dto.items)

      // Update purchase with order information and set state to ORDER_REQUESTED
      await this.prisma.purchase.update({
        where: { id: purchaseId },
        data: {
          orderId: orderInfo.id,
          preparationTime: orderInfo.preparationTime,
          state: 'ORDER_REQUESTED',
        },
      })

      // Step 3 - Book delivery with carrier
      this.logger.log('Booking delivery with carrier')
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + orderInfo.preparationTime)

      const deliveryInfo: InfoDeliveryDTO = {
        orderId: orderInfo.id,
        deliveryDate: deliveryDate,
        originAddress: providerInfo.address,
        destinationAddress: `${dto.address.street}, ${dto.address.number}, ${dto.address.state}`,
      }

      const voucher = await this.carrierClient.bookDelivery(deliveryInfo)

      // Final update - Set state to RESERVE_DELIVERED
      const finalPurchase = await this.prisma.purchase.update({
        where: { id: purchaseId },
        data: {
          deliveryDate: new Date(voucher.deliveryForecast),
          voucher: voucher.number,
          state: 'RESERVE_DELIVERED',
        },
      })

      this.logger.log(`Purchase completed successfully with ID: ${purchaseId}`)
      return finalPurchase

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Purchase failed: ${message}`)
      
      // Return purchase in current state if it was created
      if (purchaseId !== undefined) {
        const currentPurchase = await this.prisma.purchase.findUnique({
          where: { id: purchaseId },
        })
        if (currentPurchase) {
          this.logger.warn(`Returning purchase in state: ${currentPurchase.state}`)
          return currentPurchase
        }
      }

      throw error
    }
  }

  // Fallback method for when services are down
  async makePurchaseFallback(dto: CreatePurchaseDTO): Promise<Purchase> {
    this.logger.warn('Using fallback method - services unavailable')
    
    return this.prisma.purchase.create({
      data: {
        destinationAddress: `${dto.address.street}, ${dto.address.number}, ${dto.address.state}`,
        state: 'RECEIVED',
      },
    })
  }
}
