jest.mock('@nest-microservices/shared', () => ({
  RABBITMQ_QUEUES: {
    PURCHASE_CREATED: 'purchase.created',
    ORDER_COMPLETED: 'order.completed',
    DELIVERY_COMPLETED: 'delivery.completed',
    PURCHASE_COMPLETED: 'purchase.completed',
  },
}))

import { PurchasesService } from './purchases.service'
import { NotFoundException } from '@nestjs/common'

describe('PurchasesService', () => {
  let service: PurchasesService
  let mockPrisma: any
  let mockSupplierClient: any
  let mockCarrierClient: any
  let mockRabbitMQ: any

  beforeEach(() => {
    mockPrisma = {
      purchase: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    }

    mockSupplierClient = {
      getInfoProviderByState: jest.fn(),
      placeOrder: jest.fn(),
    }

    mockCarrierClient = {
      bookDelivery: jest.fn(),
    }

    mockRabbitMQ = {
      publish: jest.fn().mockResolvedValue(true),
      consume: jest.fn().mockResolvedValue(undefined),
      isConnected: jest.fn().mockReturnValue(true),
    }

    service = new PurchasesService(
      mockPrisma,
      mockSupplierClient,
      mockCarrierClient,
      mockRabbitMQ
    )
  })

  describe('findAll', () => {
    it('should return array of purchases', async () => {
      const purchases = [{ id: 1, state: 'RECEIVED' }, { id: 2, state: 'COMPLETED' }]
      mockPrisma.purchase.findMany.mockResolvedValue(purchases)

      const result = await service.findAll()

      expect(result).toEqual(purchases)
      expect(mockPrisma.purchase.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should return empty array when no purchases', async () => {
      mockPrisma.purchase.findMany.mockResolvedValue([])

      const result = await service.findAll()

      expect(result).toEqual([])
    })
  })

  describe('findOne', () => {
    it('should return a purchase by id', async () => {
      const purchase = { id: 1, state: 'RECEIVED' }
      mockPrisma.purchase.findUnique.mockResolvedValue(purchase)

      const result = await service.findOne(1)

      expect(result).toEqual(purchase)
      expect(mockPrisma.purchase.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('should throw NotFoundException if purchase not found', async () => {
      mockPrisma.purchase.findUnique.mockResolvedValue(null)

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
    })
  })

  describe('makePurchase', () => {
    it('should create a purchase and publish to queue', async () => {
      const purchase = { id: 1, state: 'RECEIVED', destinationAddress: 'Main St, 123, SP' }
      mockPrisma.purchase.create.mockResolvedValue(purchase)

      const dto = {
        items: [{ id: 1, amount: 2 }],
        address: { street: 'Main St', number: 123, state: 'SP' },
      }

      const result = await service.makePurchase(dto)

      expect(result).toEqual(purchase)
      expect(mockPrisma.purchase.create).toHaveBeenCalledWith({
        data: {
          destinationAddress: 'Main St, 123, SP',
          state: 'RECEIVED',
        },
      })
      expect(mockRabbitMQ.publish).toHaveBeenCalledWith(
        'purchase.created',
        expect.objectContaining({
          purchaseId: 1,
          items: dto.items,
          state: 'RECEIVED',
        })
      )
    })

    it('should throw error when purchase fails', async () => {
      mockPrisma.purchase.create.mockRejectedValue(new Error('DB error'))

      const dto = {
        items: [{ id: 1, amount: 2 }],
        address: { street: 'Main St', number: 123, state: 'SP' },
      }

      await expect(service.makePurchase(dto)).rejects.toThrow('DB error')
    })
  })

  describe('makePurchaseSync', () => {
    it('should complete full purchase flow synchronously', async () => {
      const createdPurchase = { id: 1, state: 'RECEIVED' }
      const updatedPurchase = { id: 1, state: 'ORDER_REQUESTED', orderId: '123' }
      const finalPurchase = { id: 1, state: 'RESERVE_DELIVERED', voucher: 'VOUCHER-001' }

      mockPrisma.purchase.create.mockResolvedValue(createdPurchase)
      mockPrisma.purchase.findUnique
        .mockResolvedValueOnce(createdPurchase)
        .mockResolvedValueOnce(updatedPurchase)
      mockPrisma.purchase.update
        .mockResolvedValueOnce(updatedPurchase)
        .mockResolvedValueOnce(finalPurchase)
      mockSupplierClient.getInfoProviderByState.mockResolvedValue({ address: 'Provider Address' })
      mockSupplierClient.placeOrder.mockResolvedValue({ id: '123', preparationTime: 2 })
      mockCarrierClient.bookDelivery.mockResolvedValue({ number: 'VOUCHER-001', deliveryForecast: new Date() })

      const dto = {
        items: [{ id: 1, amount: 2 }],
        address: { street: 'Main St', number: 123, state: 'SP' },
      }

      const result = await service.makePurchaseSync(dto)

      expect(result).toEqual(finalPurchase)
      expect(mockSupplierClient.getInfoProviderByState).toHaveBeenCalledWith('SP')
      expect(mockSupplierClient.placeOrder).toHaveBeenCalledWith(dto.items)
      expect(mockCarrierClient.bookDelivery).toHaveBeenCalled()
    })

    it('should return current purchase on error if exists', async () => {
      const purchase = { id: 1, state: 'RECEIVED' }

      mockPrisma.purchase.create.mockResolvedValue(purchase)
      mockPrisma.purchase.findUnique.mockResolvedValue(purchase)
      mockSupplierClient.getInfoProviderByState.mockRejectedValue(new Error('Service down'))

      const dto = {
        items: [{ id: 1, amount: 2 }],
        address: { street: 'Main St', number: 123, state: 'SP' },
      }

      const result = await service.makePurchaseSync(dto)

      expect(result).toEqual(purchase)
    })

    it('should throw error when purchaseId is undefined', async () => {
      mockPrisma.purchase.create.mockRejectedValue(new Error('DB error'))

      const dto = {
        items: [{ id: 1, amount: 2 }],
        address: { street: 'Main St', number: 123, state: 'SP' },
      }

      await expect(service.makePurchaseSync(dto)).rejects.toThrow('DB error')
    })
  })

  describe('makePurchaseFallback', () => {
    it('should create purchase without calling external services', async () => {
      const purchase = { id: 1, state: 'RECEIVED' }
      mockPrisma.purchase.create.mockResolvedValue(purchase)

      const dto = {
        items: [{ id: 1, amount: 2 }],
        address: { street: 'Main St', number: 123, state: 'SP' },
      }

      const result = await service.makePurchaseFallback(dto)

      expect(result).toEqual(purchase)
      expect(mockSupplierClient.getInfoProviderByState).not.toHaveBeenCalled()
      expect(mockSupplierClient.placeOrder).not.toHaveBeenCalled()
      expect(mockCarrierClient.bookDelivery).not.toHaveBeenCalled()
    })
  })

  describe('onModuleInit', () => {
    it('should setup consumers', async () => {
      await service.onModuleInit()
      expect(mockRabbitMQ.consume).toHaveBeenCalledWith(
        'order.completed',
        expect.any(Function)
      )
      expect(mockRabbitMQ.consume).toHaveBeenCalledWith(
        'delivery.completed',
        expect.any(Function)
      )
    })
  })

  describe('handleOrderCompleted', () => {
    it('should handle order completed message', async () => {
      const message = {
        purchaseId: 1,
        orderId: '123',
        preparationTime: 2,
        providerAddress: 'Provider Address',
      }

      const purchase = { id: 1, destinationAddress: 'Main St, 123, SP' }
      mockPrisma.purchase.update.mockResolvedValue({})
      mockPrisma.purchase.findUnique.mockResolvedValue(purchase)
      mockCarrierClient.bookDelivery.mockResolvedValue({ number: 'V-001', deliveryForecast: new Date() })

      await (service as any).handleOrderCompleted(message)

      expect(mockPrisma.purchase.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          orderId: '123',
          preparationTime: 2,
          state: 'ORDER_REQUESTED',
        },
      })
      expect(mockCarrierClient.bookDelivery).toHaveBeenCalled()
      expect(mockRabbitMQ.publish).toHaveBeenCalledWith(
        'delivery.completed',
        expect.objectContaining({ purchaseId: 1 })
      )
    })

    it('should not call carrier if purchase not found', async () => {
      const message = {
        purchaseId: 1,
        orderId: '123',
        preparationTime: 2,
        providerAddress: 'Provider Address',
      }

      mockPrisma.purchase.update.mockResolvedValue({})
      mockPrisma.purchase.findUnique.mockResolvedValue(null)

      await (service as any).handleOrderCompleted(message)

      expect(mockCarrierClient.bookDelivery).not.toHaveBeenCalled()
    })
  })

  describe('handleDeliveryCompleted', () => {
    it('should handle delivery completed message', async () => {
      const message = {
        purchaseId: 1,
        orderId: '123',
        voucherNumber: 'V-001',
        deliveryForecast: new Date().toISOString(),
      }

      mockPrisma.purchase.update.mockResolvedValue({})

      await (service as any).handleDeliveryCompleted(message)

      expect(mockPrisma.purchase.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          deliveryDate: expect.any(Date),
          voucher: 'V-001',
          state: 'RESERVE_DELIVERED',
        },
      })
      expect(mockRabbitMQ.publish).toHaveBeenCalledWith(
        'purchase.completed',
        expect.objectContaining({ purchaseId: 1, state: 'RESERVE_DELIVERED' })
      )
    })
  })
})
