import { Injectable, LoggerService } from '@nestjs/common'
import pino from 'pino'

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: pino.Logger

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV !== 'production' ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      } : undefined,
    })
  }

  log(message: string, context?: string) {
    this.logger.info({ context }, message)
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({ trace, context }, message)
  }

  warn(message: string, context?: string) {
    this.logger.warn({ context }, message)
  }

  debug(message: string, context?: string) {
    this.logger.debug({ context }, message)
  }

  verbose(message: string, context?: string) {
    this.logger.trace({ context }, message)
  }
}
