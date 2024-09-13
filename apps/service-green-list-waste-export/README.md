## Environment Settings

| Variable                            | Default                           | Description                                                                   |
| ----------------------------------- | --------------------------------- | ----------------------------------------------------------------------------- |
| `COSMOS_DB_ACCOUNT_URI`             | N/A                               | Cosmos database account endpoint.                                             |
| `COSMOS_DATABASE_NAME`              | _annex-vii_                       | Cosmos database name.                                                         |
| `COSMOS_DRAFTS_CONTAINER_NAME`      | _drafts_                          | Cosmos container name.                                                        |
| `COSMOS_SUBMISSIONS_CONTAINER_NAME` | _submissions_                     | Cosmos container name.                                                        |
| `COSMOS_TEMPLATES_CONTAINER_NAME`   | _templates_                       | Cosmos container name.                                                        |
| `APPINSIGHTS_CONNECTION_STRING`     | N/A                               | [Azure App Insights connection string][1] used for telemetry data collection. |
| `APP_ID`                            | _service-green-list-waste-export_ | DAPR App ID.                                                                  |
| `APP_PORT`                          | _3000_                            | DAPR APP port.                                                                |
| `REFERENCE_DATA_APP_ID`             | _service-reference-data_          | DAPR App ID.                                                                  |

[1]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=nodejs
