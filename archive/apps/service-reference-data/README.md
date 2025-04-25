## Environment Settings

| Variable                        | Default                  | Description                                                                   |
| ------------------------------- | ------------------------ | ----------------------------------------------------------------------------- | --- | --- |
| `COSMOS_DB_ACCOUNT_URI`         | N/A                      | Cosmos database account endpoint.                                             |
| `COSMOS_DATABASE_NAME`          | _waste-information_      | Cosmos database name.                                                         |
| `COSMOS_CONTAINER_NAME`         | _reference-data_         | Cosmos container name.                                                        |
| `APPINSIGHTS_CONNECTION_STRING` | N/A                      | [Azure App Insights connection string][1] used for telemetry data collection. |
| `APP_ID`                        | _service-reference-data_ | DAPR App ID.                                                                  |
| `APP_PORT`                      | _5000_                   | DAPR APP port.                                                                |     |     |

[1]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=nodejs
