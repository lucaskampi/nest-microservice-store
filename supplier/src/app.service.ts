import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  // Mock data for provider addresses by state
  private providersByState: Record<string, string> = {
    'SP': 'Rua das Flores, 456, São Paulo',
    'RJ': 'Avenida Atlântica, 789, Rio de Janeiro',
    'MG': 'Rua das Minas, 321, Belo Horizonte',
  }

  getProviderInfo(state: string) {
    const address = this.providersByState[state] || 'Endereço padrão, Estado desconhecido'
    return { address }
  }

  placeOrder(items: Array<{ id: number; amount: number }>) {
    // Mock order processing
    const orderId = Math.floor(Math.random() * 10000)
    const preparationTime = Math.floor(Math.random() * 5) + 1 // 1-5 days
    
    return {
      id: orderId,
      preparationTime
    }
  }
}
