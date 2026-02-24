import { Test, TestingModule } from '@nestjs/testing'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { NotFoundException } from '@nestjs/common'

describe('ProductsController', () => {
  let controller: ProductsController
  let service: ProductsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<ProductsController>(ProductsController)
    service = module.get<ProductsService>(ProductsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should return array of products', () => {
      const products = [{ id: 1, name: 'Product 1' }]
      jest.spyOn(service, 'findAll').mockReturnValue(products)

      expect(controller.findAll()).toEqual(products)
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a product', () => {
      const product = { id: 1, name: 'Product 1' }
      jest.spyOn(service, 'findOne').mockReturnValue(product)

      expect(controller.findOne(1)).toEqual(product)
      expect(service.findOne).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException', () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => {
        throw new NotFoundException('Product 1 not found')
      })

      expect(() => controller.findOne(1)).toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should create a product', () => {
      const dto = { name: 'Test', sku: 'TEST', price: 100 }
      const product = { id: 1, ...dto }
      jest.spyOn(service, 'create').mockReturnValue(product)

      expect(controller.create(dto)).toEqual(product)
      expect(service.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('update', () => {
    it('should update a product', () => {
      const dto = { name: 'Updated' }
      const product = { id: 1, name: 'Updated' }
      jest.spyOn(service, 'update').mockReturnValue(product)

      expect(controller.update(1, dto)).toEqual(product)
      expect(service.update).toHaveBeenCalledWith(1, dto)
    })
  })

  describe('remove', () => {
    it('should remove a product', () => {
      jest.spyOn(service, 'remove').mockReturnValue(undefined)

      controller.remove(1)

      expect(service.remove).toHaveBeenCalledWith(1)
    })
  })
})
