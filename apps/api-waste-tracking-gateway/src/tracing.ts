import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HapiInstrumentation } from '@opentelemetry/instrumentation-hapi';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { Resource } from '@opentelemetry/resources';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const provider = new NodeTracerProvider({
  resource: Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: `${
        process.env['APP_ID'] || 'api-waste-tracking-gateway'
      }-impl`,
    })
  ),
});

if (process.env['NODE_ENV'] === 'development') {
  provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
}

const connectionString = process.env['APPINSIGHTS_CONNECTION_STRING'];
if (connectionString !== undefined) {
  provider.addSpanProcessor(
    new BatchSpanProcessor(new AzureMonitorTraceExporter({ connectionString }))
  );
}

provider.register();
registerInstrumentations({
  instrumentations: [new HttpInstrumentation(), new HapiInstrumentation()],
});
