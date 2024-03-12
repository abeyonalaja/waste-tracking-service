import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';

if (process.env['APPINSIGHTS_CONNECTION_STRING']) {
  const connectionString = process.env['APPINSIGHTS_CONNECTION_STRING'];

  const sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'app-green-list-waste',
    }),
    spanProcessor: new BatchSpanProcessor(
      new AzureMonitorTraceExporter({ connectionString })
    ),
  });

  sdk.start();
}
