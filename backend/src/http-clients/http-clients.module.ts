import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { SupplierClient } from './supplier.client'
import { CarrierClient } from './carrier.client'

@Module({
  imports: [HttpModule],
  providers: [SupplierClient, CarrierClient],
  exports: [SupplierClient, CarrierClient],
})
export class HttpClientsModule {}
