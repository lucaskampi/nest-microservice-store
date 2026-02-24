jest.mock('amqplib', () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({
      assertExchange: jest.fn(),
      publish: jest.fn(),
      assertQueue: jest.fn(),
      bindQueue: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn(),
      nack: jest.fn(),
      close: jest.fn(),
    }),
    close: jest.fn(),
  }),
}))

import { RabbitMQService } from './rabbitmq.service'

describe('RabbitMQService', () => {
  let service: RabbitMQService

  beforeEach(async () => {
    jest.clearAllMocks()
    service = new RabbitMQService()
    await service.onModuleInit()
  })

  afterEach(async () => {
    try {
      await service.onModuleDestroy()
    } catch (e) {}
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('isConnected', () => {
    it('should return true when connected', () => {
      expect(service.isConnected()).toBe(true)
    })
  })

  describe('publish', () => {
    it('should publish message to queue', async () => {
      const result = await service.publish('test.routing', { test: true })
      expect(result).toBe(true)
    })

    it('should return false when channel not available', async () => {
      const serviceNoChannel = new RabbitMQService()
      const result = await serviceNoChannel.publish('test', {})
      expect(result).toBe(false)
    })
  })
})
