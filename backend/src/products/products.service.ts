import { Injectable, NotFoundException } from '@nestjs/common'
import { Product } from './entities/product.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductsService {
  private items: Product[] = []
  private idCounter = 1

  create(createDto: CreateProductDto): Product {
    const product: Product = {
      id: this.idCounter++,
      name: createDto.name,
      sku: createDto.sku,
      price: createDto.price,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.items.push(product)
    return product
  }

  findAll(): Product[] {
    return this.items
  }

  findOne(id: number): Product {
    const found = this.items.find((p) => p.id === id)
    if (!found) throw new NotFoundException(`Product ${id} not found`)
    return found
  }

  update(id: number, updateDto: UpdateProductDto): Product {
    const product = this.findOne(id)
    Object.assign(product, updateDto, { updatedAt: new Date() })
    return product
  }

  remove(id: number): void {
    const idx = this.items.findIndex((p) => p.id === id)
    if (idx === -1) throw new NotFoundException(`Product ${id} not found`)
    this.items.splice(idx, 1)
  }
}
