import { AppService } from './app.service'

describe('AppService', () => {
  let service: AppService

  beforeEach(() => {
    service = new AppService()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getHello', () => {
    it('should return hello message', () => {
      const result = service.getHello()
      expect(result).toEqual({ message: 'Hello from NestJS backend' })
    })
  })
})
