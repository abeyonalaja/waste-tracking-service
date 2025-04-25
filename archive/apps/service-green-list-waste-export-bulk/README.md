## Environment Settings

| Variable                        | Default                                | Description                                                                   |
| ------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| `COSMOS_DB_ACCOUNT_URI`         | N/A                                    | Cosmos database account endpoint.                                             |
| `COSMOS_DATABASE_NAME`          | _annex-vii-bulk_                       | Cosmos database name.                                                         |
| `COSMOS_DRAFTS_CONTAINER_NAME`  | _drafts_                               | Cosmos container name.                                                        |
| `SERVICE_BUS_HOST_NAME`         | N/A                                    | Service Bus host name.                                                        |
| `TASKS_QUEUE_NAME`              | _annex-vii-bulk-tasks_                 | Service Bus queue name.                                                       |
| `APPINSIGHTS_CONNECTION_STRING` | N/A                                    | [Azure App Insights connection string][1] used for telemetry data collection. |
| `APP_ID`                        | _service-green-list-waste-export-bulk_ | DAPR App ID.                                                                  |
| `APP_PORT`                      | _3000_                                 | DAPR APP port.                                                                |
| `GLW_EXPORT_APP_ID`             | _service-green-list-waste-export_      | DAPR App ID.                                                                  |

[1]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=nodejs
