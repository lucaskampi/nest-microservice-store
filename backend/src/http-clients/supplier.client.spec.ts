import { CircuitBreakerService } from '../circuit-breaker/circuit-breaker.service'
import { SupplierClient } from './supplier.client'

jest.mock('@nestjs/axios', () => ({
  HttpService: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

describe('SupplierClient', () => {
  let client: SupplierClient
  let circuitBreaker: CircuitBreakerService

  beforeEach(() => {
    circuitBreaker = new CircuitBreakerService()
    client = new SupplierClient(
      { get: jest.fn(), post: jest.fn() } as any,
      circuitBreaker
    )
  })

  it('should be defined', () => {
    expect(client).toBeDefined()
  })

  describe('getInfoProviderByState', () => {
    it('should call circuit breaker execute', async () => {
      const executeSpy = jest.spyOn(circuitBreaker, 'execute').mockResolvedValue({ provider: 'Test', address: 'Test' } as any)

      const result = await client.getInfoProviderByState('SP')

      expect(result).toEqual({ provider: 'Test', address: 'Test' })
      expect(executeSpy).toHaveBeenCalled()
    })
  })

  describe('placeOrder', () => {
    it('should call circuit breaker execute', async () => {
      const executeSpy = jest.spyOn(circuitBreaker, 'execute').mockResolvedValue({ id: '123', preparationTime: 2 } as any)

      const result = await client.placeOrder([{ id: 1, amount: 2 }])

      expect(result).toEqual({ id: '123', preparationTime: 2 })
      expect(executeSpy).toHaveBeenCalled()
    })
  })
})
