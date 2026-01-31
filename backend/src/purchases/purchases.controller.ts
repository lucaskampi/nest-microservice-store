import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { PurchasesService } from './purchases.service'
import { CreatePurchaseDTO } from './dto/create-purchase.dto'
import { Purchase } from './entities/purchase.entity'

@ApiTags('purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly service: PurchasesService) {}

  @Get()
  @ApiOperation({ summary: 'List all purchases' })
  @ApiResponse({ status: 200, description: 'Returns all purchases' })
  findAll(): Promise<Purchase[]> {
    return this.service.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get purchase by ID' })
  @ApiResponse({ status: 200, description: 'Returns purchase details' })
  @ApiResponse({ status: 404, description: 'Purchase not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Purchase> {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({ 
    summary: 'Create a new purchase',
    description: 'Creates a purchase order that coordinates with supplier and carrier services'
  })
  @ApiResponse({ status: 201, description: 'Purchase created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Service unavailable' })
  makePurchase(@Body() dto: CreatePurchaseDTO): Promise<Purchase> {
    return this.service.makePurchase(dto)
  }
}
