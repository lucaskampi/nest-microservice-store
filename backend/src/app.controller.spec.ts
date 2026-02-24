import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let controller: AppController
  let service: AppService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue({ message: 'Hello from NestJS backend' }),
          },
        },
      ],
    }).compile()

    controller = module.get<AppController>(AppController)
    service = module.get<AppService>(AppService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getRoot', () => {
    it('should return hello message', () => {
      const result = controller.getRoot()
      expect(result).toEqual({ message: 'Hello from NestJS backend' })
      expect(service.getHello).toHaveBeenCalled()
    })
  })
})
