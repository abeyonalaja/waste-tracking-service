## Environment Settings

| Variable                                    | Default                     | Description                                                                                           |
| ------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_GATEWAY_URL`               | _http://localhost:3000/api_ | Server API gateway URL. _http://localhost:3000/api_ or _/api_.                                        |
| `NEXT_PUBLIC_COOKIE_CONSENT_NAME`           | _cookieConsent_             | Cookie consent name.                                                                                  |
| `NEXT_PUBLIC_LANGUAGES_ENABLED`             | _false_                     | Feature flag for enabling internationalisation. _true_ or _false_.                                    |
| `NEXT_PUBLIC_MULTIPLES_ENABLED`             | _true_                      | Feature flag for enabling Green-List Waste Exports multiple upload. _true_ or _false_.                |
| `SERVICE_CHARGE_ENABLED`                    | _false_                     | Feature flag for enabling service charge payments. _true_ or _false_.                                 |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT`      | N/A                         | Google analytics account reference.                                                                   |
| `NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING` | N/A                         | [Azure App Insights connection string][1] used for telemetry data collection.                         |
| `DCID_CLIENT_ID`                            | N/A                         | OAuth2 app Client ID.                                                                                 |
| `DCID_CLIENT_SECRET`                        | N/A                         | OAuth2 app Client secret.                                                                             |
| `DCID_POLICY`                               | N/A                         | [Azure AD B2C policy][2] of the auth third-party provider.                                            |
| `DCID_REDIRECT`                             | N/A                         | Waste Tracking Service URL where the user will be redirected to after auth with third-party provider. |
| `DCID_SERVICE_ID`                           | N/A                         | Service ID of Waste Tracking in auth third-party provider.                                            |
| `DCID_TENANT`                               | N/A                         | Azure tenant which is hosting the auth third-party provider.                                          |
| `DCID_WELLKNOWN`                            | N/A                         | [OpenID Connect discovery endpoint][3].                                                               |
| `NEXTAUTH_SECRET`                           | N/A                         | Next auth secret.                                                                                     |
| `NEXTAUTH_URL`                              | N/A                         | Waste Tracking Service domain name.                                                                   |

[1]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=nodejs
[2]: https://learn.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
[3]: https://developers.google.com/identity/openid-connect/openid-connect#discovery
