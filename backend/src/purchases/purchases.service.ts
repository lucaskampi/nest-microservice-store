import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePurchaseDTO } from './dto/create-purchase.dto'
import { Purchase } from './entities/purchase.entity'
import { SupplierClient } from '../http-clients/supplier.client'
import { CarrierClient } from '../http-clients/carrier.client'
import { InfoDeliveryDTO } from './dto/info-delivery.dto'
import { RabbitMQService } from '../rabbitmq/rabbitmq.service'
import {
  RABBITMQ_QUEUES,
  PurchaseCreatedMessage,
  OrderCompletedMessage,
  DeliveryCompletedMessage,
  PurchaseCompletedMessage,
} from '@nest-microservices/shared'

@Injectable()
export class PurchasesService implements OnModuleInit {
  private readonly logger = new Logger(PurchasesService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly supplierClient: SupplierClient,
    private readonly carrierClient: CarrierClient,
    private readonly rabbitMQ: RabbitMQService,
  ) {}

  async onModuleInit() {
    await this.setupConsumers()
  }

  private async setupConsumers() {
    await this.rabbitMQ.consume(RABBITMQ_QUEUES.ORDER_COMPLETED, this.handleOrderCompleted.bind(this))
    await this.rabbitMQ.consume(RABBITMQ_QUEUES.DELIVERY_COMPLETED, this.handleDeliveryCompleted.bind(this))
  }

  private async handleOrderCompleted(message: OrderCompletedMessage) {
    this.logger.log(`Handling order completed for purchase ${message.purchaseId}`)
    
    await this.prisma.purchase.update({
      where: { id: message.purchaseId },
      data: {
        orderId: message.orderId,
        preparationTime: message.preparationTime,
        state: 'ORDER_REQUESTED',
      },
    })

    const purchase = await this.prisma.purchase.findUnique({ where: { id: message.purchaseId } })
    if (purchase) {
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + message.preparationTime)

      const deliveryInfo: InfoDeliveryDTO = {
        orderId: message.orderId,
        deliveryDate,
        originAddress: message.providerAddress,
        destinationAddress: purchase.destinationAddress,
      }

      const voucher = await this.carrierClient.bookDelivery(deliveryInfo)
      await this.rabbitMQ.publish(RABBITMQ_QUEUES.DELIVERY_COMPLETED, {
        purchaseId: message.purchaseId,
        orderId: message.orderId,
        voucherNumber: voucher.number,
        deliveryForecast: voucher.deliveryForecast,
      })
    }
  }

  private async handleDeliveryCompleted(message: DeliveryCompletedMessage) {
    this.logger.log(`Handling delivery completed for purchase ${message.purchaseId}`)

    await this.prisma.purchase.update({
      where: { id: message.purchaseId },
      data: {
        deliveryDate: new Date(message.deliveryForecast),
        voucher: message.voucherNumber,
        state: 'RESERVE_DELIVERED',
      },
    })

    await this.rabbitMQ.publish(RABBITMQ_QUEUES.PURCHASE_COMPLETED, {
      purchaseId: message.purchaseId,
      state: 'RESERVE_DELIVERED',
    })
  }

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
    try {
      this.logger.log('Creating new purchase with RECEIVED state')
      const purchase = await this.prisma.purchase.create({
        data: {
          destinationAddress: `${dto.address.street}, ${dto.address.number}, ${dto.address.state}`,
          state: 'RECEIVED',
        },
      })

      const message: PurchaseCreatedMessage = {
        purchaseId: purchase.id,
        items: dto.items,
        address: dto.address,
        state: 'RECEIVED',
      }

      await this.rabbitMQ.publish(RABBITMQ_QUEUES.PURCHASE_CREATED, message)
      this.logger.log(`Purchase ${purchase.id} published to queue`)

      return purchase

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Purchase failed: ${message}`)
      throw error
    }
  }

  async makePurchaseSync(dto: CreatePurchaseDTO): Promise<Purchase> {
    const state = dto.address.state
    let purchaseId: number | undefined = undefined

    try {
      this.logger.log('Creating new purchase with RECEIVED state (sync mode)')
      const purchase = await this.prisma.purchase.create({
        data: {
          destinationAddress: `${dto.address.street}, ${dto.address.number}, ${dto.address.state}`,
          state: 'RECEIVED',
        },
      })
      purchaseId = purchase.id

      this.logger.log(`Fetching provider information for state: ${state}`)
      const providerInfo = await this.supplierClient.getInfoProviderByState(state)

      this.logger.log('Placing order with supplier')
      const orderInfo = await this.supplierClient.placeOrder(dto.items)

      await this.prisma.purchase.update({
        where: { id: purchaseId },
        data: {
          orderId: orderInfo.id,
          preparationTime: orderInfo.preparationTime,
          state: 'ORDER_REQUESTED',
        },
      })

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
