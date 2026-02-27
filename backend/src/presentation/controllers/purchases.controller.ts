import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  CreatePurchaseCommand,
  GetPurchaseByIdQuery,
  GetAllPurchasesQuery,
  CreatePurchaseHandler,
  GetPurchaseByIdHandler,
  GetAllPurchasesHandler,
  CreatePurchaseDto,
} from '../../application';
import { Purchase } from '../../domain';

@Controller('purchases')
export class PurchasesController {
  constructor(
    private readonly createPurchaseHandler: CreatePurchaseHandler,
    private readonly getPurchaseByIdHandler: GetPurchaseByIdHandler,
    private readonly getAllPurchasesHandler: GetAllPurchasesHandler,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePurchaseDto): Promise<Purchase> {
    const command = new CreatePurchaseCommand(dto);
    return this.createPurchaseHandler.execute(command);
  }

  @Get()
  async findAll(): Promise<Purchase[]> {
    const query = new GetAllPurchasesQuery();
    return this.getAllPurchasesHandler.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Purchase> {
    const query = new GetPurchaseByIdQuery(id);
    return this.getPurchaseByIdHandler.execute(query);
  }
}
