## Environment Settings

| Variable                             | Default                                | Description                                                                                                                                             |
| ------------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DCID_WELLKNOWN`                     | N/A                                    | [OpenID Connect discovery endpoint][1].                                                                                                                 |
| `DCID_CLIENT_ID`                     | N/A                                    | OAuth2 app Client ID.                                                                                                                                   |
| `ALLOWED_USERS`                      | _\*_                                   | Semicolon-delimited list of DCID _uniqueReference_ values. Legacy setting for users that were onboarded manually. _none_ to disable, _\*_ for any user. |
| `ADDRESS_APP_ID`                     | _service-address_                      | DAPR App ID.                                                                                                                                            |
| `FEEDBACK_APP_ID`                    | _service-feedback_                     | DAPR App ID.                                                                                                                                            |
| `GLW_EXPORT_APP_ID`                  | _service-green-list-waste-export_      | DAPR App ID.                                                                                                                                            |
| `REFERENCE_DATA_APP_ID`              | _service-reference-data_               | DAPR App ID.                                                                                                                                            |
| `GLW_EXPORT_BULK_APP_ID`             | _service-green-list-waste-export-bulk_ | DAPR App ID.                                                                                                                                            |
| `LIMITED_AUDIENCE_APP_ID`            | _service-limited-audience_             | DAPR App ID.                                                                                                                                            |
| `UKWM_BULK_APP_ID`                   | _service-uk-waste-movements-bulk_      | DAPR App ID.                                                                                                                                            |
| `UKWM_APP_ID`                        | _service-uk-waste-movements_           | DAPR App ID.                                                                                                                                            |
| `PAYMENT_APP_ID`                     | _service-payment_                      | DAPR App ID.                                                                                                                                            |
| `APP_ID`                             | _api-waste-tracking-gateway_           | DAPR App ID.                                                                                                                                            |
| `APP_PORT`                           | _3000_                                 | DAPR App port.                                                                                                                                          |
| `FEATURE_PRIVATE_AUDIENCE_CHECKS`    | _false_                                | Feature flag for checking users' memebership of Private Beta. _true_ or _false_.                                                                        |
| `IS_UKWM_BATCHES_ENABLED`            | _false_                                | Feature flag for enabling UK Waste Movements multiple upload. _true_ or _false_.                                                                        |
| `IS_SERVICE_CHARGE_ENABLED`          | _false_                                | Feature flag for enabling service charge payments. _true_ or _false_.                                                                                   |
| `IS_MULTIPLE_UPLOAD_ENABLED`         | _false_                                | Feature flag for enabling Green-List Waste Exports multiple upload. _true_ or _false_.                                                                  |
| `IS_AUTO_EMAIL_CONFIRMATION_ENABLED` | _false_                                | Placeholder: feature flag for email confirmation. _true_ or _false_.                                                                                    |
| `APPINSIGHTS_CONNECTION_STRING`      | N/A                                    | [Azure App Insights connection string][2] used for telemetry data collection.                                                                           |

[1]: https://developers.google.com/identity/openid-connect/openid-connect#discovery
[2]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=nodejs
