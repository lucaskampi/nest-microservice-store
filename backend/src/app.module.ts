import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProductsModule } from './products/products.module'
import { PurchasesModule } from './purchases/purchases.module'
import { HealthModule } from './health/health.module'
import { RabbitMQModule } from './rabbitmq/rabbitmq.module'
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module'

@Module({
  imports: [ProductsModule, PurchasesModule, HealthModule, RabbitMQModule, CircuitBreakerModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
