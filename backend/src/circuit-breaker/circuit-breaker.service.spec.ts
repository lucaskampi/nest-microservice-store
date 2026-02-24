import { CircuitBreakerService } from './circuit-breaker.service'

describe('CircuitBreakerService', () => {
  let service: CircuitBreakerService

  beforeEach(() => {
    service = new CircuitBreakerService()
  })

  afterEach(() => {
    jest.useRealTimers()
    service.reset()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('initial state', () => {
    it('should start in CLOSED state', () => {
      expect(service.getState()).toBe('CLOSED')
    })
  })

  describe('execute - successful operation', () => {
    it('should execute operation successfully', async () => {
      const result = await service.execute(async () => 'success')
      expect(result).toBe('success')
    })

    it('should remain in CLOSED state after successful execution', async () => {
      await service.execute(async () => 'success')
      expect(service.getState()).toBe('CLOSED')
    })
  })

  describe('execute - failed operation', () => {
    it('should throw error when operation fails', async () => {
      await expect(
        service.execute(async () => { throw new Error('fail') })
      ).rejects.toThrow('fail')
    })

    it('should transition to OPEN after failure threshold', async () => {
      for (let i = 0; i < 5; i++) {
        try {
          await service.execute(async () => { throw new Error('fail') })
        } catch (e) {}
      }
      expect(service.getState()).toBe('OPEN')
    })
  })

  describe('HALF_OPEN state', () => {
    it('should transition to HALF_OPEN after timeout in OPEN state', async () => {
      for (let i = 0; i < 5; i++) {
        try {
          await service.execute(async () => { throw new Error('fail') })
        } catch (e) {}
      }
      expect(service.getState()).toBe('OPEN')

      jest.useFakeTimers()
      jest.setSystemTime(Date.now() + 30001)

      const result = await service.execute(async () => 'success')
      expect(result).toBe('success')
      expect(service.getState()).toBe('HALF_OPEN')
    })

    it('should transition back to CLOSED after success threshold in HALF_OPEN', async () => {
      for (let i = 0; i < 5; i++) {
        try {
          await service.execute(async () => { throw new Error('fail') })
        } catch (e) {}
      }

      jest.useFakeTimers()
      jest.setSystemTime(Date.now() + 30001)

      await service.execute(async () => 'success')
      expect(service.getState()).toBe('HALF_OPEN')

      await service.execute(async () => 'success')
      expect(service.getState()).toBe('CLOSED')
    })

    it('should transition back to OPEN after failure in HALF_OPEN', async () => {
      for (let i = 0; i < 5; i++) {
        try {
          await service.execute(async () => { throw new Error('fail') })
        } catch (e) {}
      }

      jest.useFakeTimers()
      jest.setSystemTime(Date.now() + 30001)

      await service.execute(async () => 'success')
      expect(service.getState()).toBe('HALF_OPEN')

      try {
        await service.execute(async () => { throw new Error('fail') })
      } catch (e) {}

      expect(service.getState()).toBe('OPEN')
    })
  })

  describe('OPEN state', () => {
    it('should throw error immediately when in OPEN state before timeout', async () => {
      for (let i = 0; i < 5; i++) {
        try {
          await service.execute(async () => { throw new Error('fail') })
        } catch (e) {}
      }

      await expect(
        service.execute(async () => 'success')
      ).rejects.toThrow('Circuit breaker is OPEN')
    })
  })

  describe('reset', () => {
    it('should reset to CLOSED state', async () => {
      for (let i = 0; i < 5; i++) {
        try {
          await service.execute(async () => { throw new Error('fail') })
        } catch (e) {}
      }

      service.reset()
      expect(service.getState()).toBe('CLOSED')
    })

    it('should allow execution after reset', async () => {
      for (let i = 0; i < 5; i++) {
        try {
          await service.execute(async () => { throw new Error('fail') })
        } catch (e) {}
      }

      service.reset()
      const result = await service.execute(async () => 'success')
      expect(result).toBe('success')
    })
  })
})
