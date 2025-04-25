## Environment Settings

| Variable                               | Default                                     | Description                                                                   |
| -------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------- | --- | --- |
| `COSMOS_DB_ACCOUNT_URI`                | N/A                                         | Cosmos database account endpoint.                                             |
| `COSMOS_DATABASE_NAME`                 | _payment_                                   | Cosmos database name.                                                         |
| `COSMOS_DRAFTS_CONTAINER_NAME`         | _drafts_                                    | Cosmos container name.                                                        |
| `COSMOS_SERVICE_CHARGE_CONTAINER_NAME` | _service-charges_                           | Cosmos container name.                                                        |
| `GOVUK_PAY_API_URL`                    | _https://publicapi.payments.service.gov.uk_ | Endpoint URL for payment third-party API.                                     |
| `GOVUK_PAY_API_KEY`                    | N/A                                         | API key for accessing third-party payment API.                                |
| `APPINSIGHTS_CONNECTION_STRING`        | N/A                                         | [Azure App Insights connection string][1] used for telemetry data collection. |
| `APP_ID`                               | _service-payment_                           | DAPR App ID.                                                                  |
| `APP_PORT`                             | _3000_                                      | DAPR APP port.                                                                |     |     |

## Third-party dependencies

The service is using OpenAPI specification of Gov.UK Pay API found on: [GitHub][2].

The given specification was used to generate a local type file following the approach described in: [openapi-typescript][3].

The consumption of the third-party dependency is done via: [openapi-fetch][4] and a capability to typecheck can be ran with the following command:

```
nx typecheck service-payment
```

[1]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=nodejs
[2]: https://github.com/alphagov/pay-publicapi/blob/master/openapi/publicapi_spec.json
[3]: https://github.com/openapi-ts/openapi-typescript/tree/main/packages/openapi-typescript#basic-usage
[4]: https://github.com/openapi-ts/openapi-typescript/tree/main/packages/openapi-fetch#-setup
