import { ProductsService } from './products.service'
import { NotFoundException } from '@nestjs/common'

describe('ProductsService', () => {
  let service: ProductsService

  beforeEach(() => {
    service = new ProductsService()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a product', () => {
      const dto = { name: 'Test Product', sku: 'TEST-001', price: 100 }
      const result = service.create(dto)

      expect(result).toEqual(expect.objectContaining({
        name: 'Test Product',
        sku: 'TEST-001',
        price: 100,
      }))
      expect(result.id).toBeDefined()
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('findAll', () => {
    it('should return empty array initially', () => {
      const result = service.findAll()
      expect(result).toEqual([])
    })

    it('should return all products', () => {
      service.create({ name: 'Product 1', sku: 'SKU-1', price: 100 })
      service.create({ name: 'Product 2', sku: 'SKU-2', price: 200 })

      const result = service.findAll()
      expect(result).toHaveLength(2)
    })
  })

  describe('findOne', () => {
    it('should return a product by id', () => {
      const created = service.create({ name: 'Test', sku: 'TEST', price: 50 })
      const result = service.findOne(created.id)

      expect(result).toEqual(created)
    })

    it('should throw NotFoundException if product not found', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update a product', () => {
      const created = service.create({ name: 'Test', sku: 'TEST', price: 50 })
      const result = service.update(created.id, { name: 'Updated' })

      expect(result.name).toBe('Updated')
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it('should throw NotFoundException when updating non-existent product', () => {
      expect(() => service.update(999, { name: 'Test' })).toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('should remove a product', () => {
      const created = service.create({ name: 'Test', sku: 'TEST', price: 50 })
      service.remove(created.id)

      expect(() => service.findOne(created.id)).toThrow(NotFoundException)
    })

    it('should throw NotFoundException when removing non-existent product', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException)
    })
  })
})
