jest.mock('@nest-microservices/shared', () => ({
  RABBITMQ_QUEUES: {
    PURCHASE_CREATED: 'purchase.created',
    ORDER_COMPLETED: 'order.completed',
    DELIVERY_COMPLETED: 'delivery.completed',
    PURCHASE_COMPLETED: 'purchase.completed',
  },
}))

import { Test, TestingModule } from '@nestjs/testing'
import { PurchasesController } from './purchases.controller'
import { PurchasesService } from './purchases.service'
import { NotFoundException } from '@nestjs/common'

describe('PurchasesController', () => {
  let controller: PurchasesController
  let service: PurchasesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesController],
      providers: [
        {
          provide: PurchasesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            makePurchase: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<PurchasesController>(PurchasesController)
    service = module.get<PurchasesService>(PurchasesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should return array of purchases', async () => {
      const purchases = [{ id: 1, state: 'RECEIVED' }]
      jest.spyOn(service, 'findAll').mockResolvedValue(purchases)

      expect(await controller.findAll()).toEqual(purchases)
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a purchase', async () => {
      const purchase = { id: 1, state: 'RECEIVED' }
      jest.spyOn(service, 'findOne').mockResolvedValue(purchase)

      expect(await controller.findOne(1)).toEqual(purchase)
      expect(service.findOne).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Purchase with ID 1 not found'))

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('makePurchase', () => {
    it('should create a purchase', async () => {
      const dto = {
        items: [{ id: 1, amount: 2 }],
        address: { street: 'Main St', number: 123, state: 'SP' },
      }
      const purchase = { id: 1, state: 'RECEIVED', destinationAddress: 'Main St, 123, SP' }
      jest.spyOn(service, 'makePurchase').mockResolvedValue(purchase)

      expect(await controller.makePurchase(dto)).toEqual(purchase)
      expect(service.makePurchase).toHaveBeenCalledWith(dto)
    })
  })
})
