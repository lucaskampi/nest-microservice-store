jest.mock('pino', () => {
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  }
  return jest.fn(() => mockLogger)
})

jest.mock('pino-pretty', () => () => 'mock-pino-pretty')

import { CustomLogger } from './custom-logger.service'

describe('CustomLogger', () => {
  let logger: CustomLogger
  let mockPino: any

  beforeEach(() => {
    jest.clearAllMocks()
    logger = new CustomLogger()
    mockPino = require('pino')()
  })

  it('should be defined', () => {
    expect(logger).toBeDefined()
  })

  describe('log', () => {
    it('should log info message', () => {
      logger.log('test message', 'context')
      expect(mockPino.info).toHaveBeenCalledWith({ context: 'context' }, 'test message')
    })

    it('should log info without context', () => {
      logger.log('test message')
      expect(mockPino.info).toHaveBeenCalledWith({}, 'test message')
    })
  })

  describe('error', () => {
    it('should log error message', () => {
      logger.error('test error', 'trace', 'context')
      expect(mockPino.error).toHaveBeenCalledWith({ trace: 'trace', context: 'context' }, 'test error')
    })

    it('should log error without context', () => {
      logger.error('test error', 'trace')
      expect(mockPino.error).toHaveBeenCalledWith({ trace: 'trace' }, 'test error')
    })
  })

  describe('warn', () => {
    it('should log warning message', () => {
      logger.warn('test warning', 'context')
      expect(mockPino.warn).toHaveBeenCalledWith({ context: 'context' }, 'test warning')
    })
  })

  describe('debug', () => {
    it('should log debug message', () => {
      logger.debug('test debug', 'context')
      expect(mockPino.debug).toHaveBeenCalledWith({ context: 'context' }, 'test debug')
    })
  })

  describe('verbose', () => {
    it('should log verbose message', () => {
      logger.verbose('test verbose', 'context')
      expect(mockPino.trace).toHaveBeenCalledWith({ context: 'context' }, 'test verbose')
    })
  })
})
