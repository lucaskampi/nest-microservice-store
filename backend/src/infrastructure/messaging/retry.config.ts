export interface RetryConfigOptions {
  maxRetries: number;
  initialDelay?: number;
  maxDelay?: number;
  multiplier?: number;
  jitter?: number;
}

const NON_RETRYABLE_ERRORS = [
  'validation',
  'invalid',
  'duplicate',
  'not found',
  'unauthorized',
  'forbidden',
  'bad request',
];

const RETRYABLE_ERRORS = [
  'econnrefused',
  'etimedout',
  'timeout',
  'enotfound',
  'network',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'socket',
  'closed',
];

export class RetryConfig {
  readonly maxRetries: number;
  readonly initialDelay: number;
  readonly maxDelay: number;
  readonly multiplier: number;
  readonly jitter: number;

  constructor(options: RetryConfigOptions) {
    this.maxRetries = options.maxRetries;
    this.initialDelay = options.initialDelay ?? 1000;
    this.maxDelay = options.maxDelay ?? 10000;
    this.multiplier = options.multiplier ?? 2;
    this.jitter = options.jitter ?? 0.1;
  }

  calculateDelay(attempt: number): number {
    const exponentialDelay = this.initialDelay * Math.pow(this.multiplier, attempt);
    const cappedDelay = Math.min(exponentialDelay, this.maxDelay);
    
    const jitterRange = cappedDelay * this.jitter;
    const jitter = (Math.random() * 2 - 1) * jitterRange;
    
    return Math.round(cappedDelay + jitter);
  }

  shouldRetry(error: Error, currentRetry: number): boolean {
    if (currentRetry >= this.maxRetries) {
      return false;
    }
    return this.isRetryableError(error);
  }

  isRetryableError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    
    for (const pattern of NON_RETRYABLE_ERRORS) {
      if (errorMessage.includes(pattern)) {
        return false;
      }
    }
    
    for (const pattern of RETRYABLE_ERRORS) {
      if (errorMessage.includes(pattern.toLowerCase())) {
        return true;
      }
    }
    
    return true;
  }
}
