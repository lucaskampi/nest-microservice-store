import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { Resource } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

@Injectable()
export class TracingService implements OnModuleInit {
  private readonly logger = new Logger(TracingService.name)
  private sdk: NodeSDK

  constructor(private readonly serviceName: string) {
    this.sdk = new NodeSDK({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
      }),
      traceExporter: new JaegerExporter({
        endpoint: process.env.JAEGER_URL || 'http://localhost:14268/api/traces',
      }),
      spanProcessor: new BatchSpanProcessor(
        new JaegerExporter({
          endpoint: process.env.JAEGER_URL || 'http://localhost:14268/api/traces',
        }),
      ),
      instrumentations: [
        getNodeAutoInstrumentations(),
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
      ],
    })
  }

  async onModuleInit() {
    try {
      await this.sdk.start()
      this.logger.log('OpenTelemetry tracing initialized')
    } catch (error) {
      this.logger.error('Failed to initialize OpenTelemetry', error)
    }
  }

  async onModuleDestroy() {
    await this.sdk.shutdown()
  }
}
