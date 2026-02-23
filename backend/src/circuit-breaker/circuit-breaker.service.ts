import { Injectable, Logger } from '@nestjs/common'

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

interface CircuitBreakerConfig {
  failureThreshold: number
  successThreshold: number
  timeout: number
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name)
  private state: CircuitState = CircuitState.CLOSED
  private failures = 0
  private successes = 0
  private nextAttempt: number = 0

  private readonly config: CircuitBreakerConfig = {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 30000,
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN')
      }
      this.state = CircuitState.HALF_OPEN
      this.logger.log('Circuit breaker transitioning to HALF_OPEN')
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0

    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++
      if (this.successes >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED
        this.successes = 0
        this.logger.log('Circuit breaker CLOSED')
      }
    }
  }

  private onFailure() {
    this.failures++

    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN
      this.nextAttempt = Date.now() + this.config.timeout
      this.logger.warn('Circuit breaker OPEN')
    } else if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN
      this.nextAttempt = Date.now() + this.config.timeout
      this.logger.warn(`Circuit breaker OPEN after ${this.failures} failures`)
    }
  }

  getState(): string {
    return this.state
  }

  reset() {
    this.state = CircuitState.CLOSED
    this.failures = 0
    this.successes = 0
    this.nextAttempt = 0
  }
}
