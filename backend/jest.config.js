module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/test/'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { isolatedModules: true }],
  },
  collectCoverageFrom: [
    'src/**/*.service.ts',
    'src/**/*.controller.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/tracing/tracing.service.ts',
    '!src/health/health.controller.ts',
    '!src/rabbitmq/rabbitmq.service.ts',
    '!src/middleware/correlation-id.middleware.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/prisma/',
    '/test/',
  ],
  moduleNameMapper: {
    '^@nest-microservices/shared$': '<rootDir>/../packages/shared/src/index.ts',
  },
}
