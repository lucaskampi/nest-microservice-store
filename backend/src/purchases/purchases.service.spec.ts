import { Test, TestingModule } from '@nestjs/testing'
import { PurchasesService } from './purchases.service'
import { PrismaService } from '../prisma/prisma.service'
import { SupplierClient } from '../http-clients/supplier.client'
import { CarrierClient } from '../http-clients/carrier.client'
import { RabbitMQService } from '../rabbitmq/rabbitmq.service'

describe('PurchasesService', () => {
  let service: PurchasesService
  let prisma: jest.Mocked<PrismaService>
  let supplierClient: jest.Mocked<SupplierClient>
  let carrierClient: jest.Mocked<CarrierClient>
  let rabbitMQ: jest.Mocked<RabbitMQService>

  beforeEach(async () => {
    const mockPrisma = {
      purchase: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    }

    const mockSupplierClient = {
      getInfoProviderByState: jest.fn(),
      placeOrder: jest.fn(),
    }

    const mockCarrierClient = {
      bookDelivery: jest.fn(),
    }

    const mockRabbitMQ = {
      publish: jest.fn(),
      consume: jest.fn(),
      isConnected: jest.fn().mockReturnValue(true),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchasesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SupplierClient, useValue: mockSupplierClient },
        { provide: CarrierClient, useValue: mockCarrierClient },
        { provide: RabbitMQService, useValue: mockRabbitMQ },
      ],
    }).compile()

    service = module.get<PurchasesService>(PurchasesService)
    prisma = module.get(PrismaService)
    supplierClient = module.get(SupplierClient)
    carrierClient = module.get(CarrierClient)
    rabbitMQ = module.get(RabbitMQService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of purchases', async () => {
      const purchases = [{ id: 1, state: 'RECEIVED' }, { id: 2, state: 'COMPLETED' }]
      prisma.purchase.findMany.mockResolvedValue(purchases)

      const result = await service.findAll()

      expect(result).toEqual(purchases)
      expect(prisma.purchase.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } })
    })
  })

  describe('findOne', () => {
    it('should return a purchase by id', async () => {
      const purchase = { id: 1, state: 'RECEIVED' }
      prisma.purchase.findUnique.mockResolvedValue(purchase)

      const result = await service.findOne(1)

      expect(result).toEqual(purchase)
      expect(prisma.purchase.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('should throw NotFoundException if purchase not found', async () => {
      prisma.purchase.findUnique.mockResolvedValue(null)

      await expect(service.findOne(999)).rejects.toThrow('Purchase with ID 999 not found')
    })
  })

  describe('makePurchase', () => {
    it('should create a purchase and publish to queue', async () => {
      const dto = {
        items: [{ id: 1, amount: 2 }],
        address: { street: 'Main St', number: 123, state: 'SP' },
      }
      const purchase = { id: 1, state: 'RECEIVED', destinationAddress: 'Main St, 123, SP' }

      prisma.purchase.create.mockResolvedValue(purchase)
      rabbitMQ.publish.mockResolvedValue(true)

      const result = await service.makePurchase(dto)

      expect(result).toEqual(purchase)
      expect(prisma.purchase.create).toHaveBeenCalled()
      expect(rabbitMQ.publish).toHaveBeenCalled()
    })
  })
})
