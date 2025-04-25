## Environment Settings

| Variable                            | Default                    | Description                                                                   |
| ----------------------------------- | -------------------------- | ----------------------------------------------------------------------------- |
| `COSMOS_DB_ACCOUNT_URI`             | N/A                        | Cosmos database account endpoint.                                             |
| `COSMOS_DATABASE_NAME`              | _limited-audience_         | Cosmos database name.                                                         |
| `COSMOS_ASSIGNMENTS_CONTAINER_NAME` | _assignments_              | Cosmos container name.                                                        |
| `INVITATION_TOKEN_PUBLIC_KEY`       | N/A                        | Public key used for Private Beta invitation token generation.                 |
| `APPINSIGHTS_CONNECTION_STRING`     | N/A                        | [Azure App Insights connection string][1] used for telemetry data collection. |
| `APP_ID`                            | _service-limited-audience_ | DAPR App ID.                                                                  |
| `APP_PORT`                          | _3000_                     | DAPR APP port.                                                                |

[1]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=nodejs
