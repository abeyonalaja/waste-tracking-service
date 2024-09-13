## Environment Settings

| Variable                        | Default           | Description                                                                                                |
| ------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `ADDRESS_LOOKUP_URL`            | N/A               | Endpoint URL for address lookup third-party API.                                                           |
| `CERT_FOLDER`                   | N/A               | _/mnt_ folder where _.crt_ and _.key_ files used for certificate auth with address lookup API are located. |
| `CERT_NAME`                     | N/A               | Name of _.crt_ and _.key_ files used for certificate auth with address lookup API.                         |
| `APPINSIGHTS_CONNECTION_STRING` | N/A               | [Azure App Insights connection string][1] used for telemetry data collection.                              |
| `APP_ID`                        | _service-address_ | DAPR App ID.                                                                                               |
| `APP_PORT`                      | _5000_            | DAPR APP port.                                                                                             |

[1]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=nodejs
