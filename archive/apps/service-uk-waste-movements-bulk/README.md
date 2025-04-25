## Environment Settings

| Variable                        | Default                               | Description                                                                   |
| ------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------- |
| `COSMOS_DB_ACCOUNT_URI`         | N/A                                   | Cosmos database account endpoint.                                             |
| `COSMOS_DATABASE_NAME`          | _uk-waste-movements-bulk_             | Cosmos database name                                                          |
| `COSMOS_BATCHES_CONTAINER_NAME` | _batches_                             | Cosmos container name.                                                        |
| `COSMOS_ROWS_CONTAINER_NAME`    | _rows_                                | Cosmos container name.                                                        |
| `COSMOS_COLUMNS_CONTAINER_NAME` | _columns_                             | Cosmos container name.                                                        |
| `SERVICE_BUS_HOST_NAME`         | N/A                                   | Service Bus host name.                                                        |
| `TASKS_QUEUE_NAME`              | _uk-waste-movements-bulk-tasks_       | Service Bus queue name.                                                       |
| `SUBMISSIONS_QUEUE_NAME`        | _uk-waste-movements-bulk-submissions_ | Service Bus queue name.                                                       |
| `APPINSIGHTS_CONNECTION_STRING` | N/A                                   | [Azure App Insights connection string][1] used for telemetry data collection. |
| `APP_ID`                        | _service-uk-waste-movements-bulk_     | DAPR App ID.                                                                  |
| `APP_PORT`                      | _3000_                                | DAPR APP port.                                                                |
| `UKWM_APP_ID`                   | _service-uk-waste-movements_          | DAPR App ID.                                                                  |

[1]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=nodejs
