jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-1234'),
}))

import { CorrelationIdMiddleware } from './correlation-id.middleware'

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware

  beforeEach(() => {
    middleware = new CorrelationIdMiddleware()
  })

  it('should be defined', () => {
    expect(middleware).toBeDefined()
  })

  it('should generate new correlation ID when not provided', () => {
    const req = { headers: {} } as any
    const res = { setHeader: jest.fn() } as any
    const next = jest.fn()

    middleware.use(req, res, next)

    expect(req.headers['x-correlation-id']).toBe('mocked-uuid-1234')
    expect(res.setHeader).toHaveBeenCalledWith('x-correlation-id', 'mocked-uuid-1234')
    expect(next).toHaveBeenCalled()
  })

  it('should use existing correlation ID when provided', () => {
    const req = { headers: { 'x-correlation-id': 'existing-id' } } as any
    const res = { setHeader: jest.fn() } as any
    const next = jest.fn()

    middleware.use(req, res, next)

    expect(req.headers['x-correlation-id']).toBe('existing-id')
    expect(res.setHeader).toHaveBeenCalledWith('x-correlation-id', 'existing-id')
    expect(next).toHaveBeenCalled()
  })
})
