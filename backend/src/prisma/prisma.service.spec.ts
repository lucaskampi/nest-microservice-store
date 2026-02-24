import { PrismaService } from './prisma.service'

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  })),
}))

describe('PrismaService', () => {
  let service: PrismaService

  beforeEach(() => {
    service = new PrismaService()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should have $connect method', () => {
    expect(typeof service.$connect).toBe('function')
  })

  it('should have $disconnect method', () => {
    expect(typeof service.$disconnect).toBe('function')
  })
})
