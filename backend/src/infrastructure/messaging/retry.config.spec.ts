import { RetryConfig } from './retry.config';

describe('RetryConfig', () => {
  describe('calculateDelay', () => {
    it('should return initial delay for first retry', () => {
      const config = new RetryConfig({ maxRetries: 3, initialDelay: 1000 });
      const delay = config.calculateDelay(0);
      expect(delay).toBeGreaterThanOrEqual(900); // With jitter
      expect(delay).toBeLessThanOrEqual(1100);
    });

    it('should exponentially increase delay', () => {
      const config = new RetryConfig({ maxRetries: 3, initialDelay: 1000, multiplier: 2 });
      const delay0 = config.calculateDelay(0);
      const delay1 = config.calculateDelay(1);
      const delay2 = config.calculateDelay(2);

      expect(delay1).toBeGreaterThan(delay0);
      expect(delay2).toBeGreaterThan(delay1);
    });

    it('should cap delay at maxDelay', () => {
      const config = new RetryConfig({ 
        maxRetries: 10, 
        initialDelay: 1000, 
        maxDelay: 2000,
        multiplier: 10 
      });
      const delay = config.calculateDelay(5);
      expect(delay).toBeLessThanOrEqual(2000);
    });

    it('should add jitter to prevent thundering herd', () => {
      const delays: number[] = [];
      const config = new RetryConfig({ maxRetries: 10, initialDelay: 1000, jitter: 0.3 });
      
      for (let i = 0; i < 100; i++) {
        delays.push(config.calculateDelay(0));
      }

      const uniqueDelays = new Set(delays);
      expect(uniqueDelays.size).toBeGreaterThan(1);
    });
  });

  describe('shouldRetry', () => {
    it('should return true for retryable errors', () => {
      const config = new RetryConfig({ maxRetries: 3 });
      expect(config.shouldRetry(new Error('ECONNREFUSED'), 0)).toBe(true);
      expect(config.shouldRetry(new Error('timeout'), 0)).toBe(true);
    });

    it('should return false for non-retryable errors', () => {
      const config = new RetryConfig({ maxRetries: 3 });
      expect(config.shouldRetry(new Error('ValidationError'), 0)).toBe(false);
      expect(config.shouldRetry(new Error('Duplicate key'), 0)).toBe(false);
    });

    it('should return false when max retries exceeded', () => {
      const config = new RetryConfig({ maxRetries: 3 });
      expect(config.shouldRetry(new Error('timeout'), 3)).toBe(false);
    });
  });

  describe('isRetryableError', () => {
    it('should identify network errors as retryable', () => {
      const config = new RetryConfig({ maxRetries: 3 });
      expect(config.isRetryableError(new Error('ECONNREFUSED'))).toBe(true);
      expect(config.isRetryableError(new Error('ETIMEDOUT'))).toBe(true);
      expect(config.isRetryableError(new Error('ENOTFOUND'))).toBe(true);
    });

    it('should identify validation errors as not retryable', () => {
      const config = new RetryConfig({ maxRetries: 3 });
      expect(config.isRetryableError(new Error('Invalid data'))).toBe(false);
      expect(config.isRetryableError(new Error('Validation failed'))).toBe(false);
    });
  });
});
