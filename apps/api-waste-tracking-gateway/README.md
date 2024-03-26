## Environment Settings

| Variable                          | Default                                | Description                                                                                                                                             |
| --------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DCID_WELLKNOWN`                  | N/A                                    | [OpenID Connect discovery endpoint][1].                                                                                                                 |
| `DCID_CLIENT_ID`                  | N/A                                    | OAuth2 app Client ID.                                                                                                                                   |
| `ALLOWED_USERS`                   | _\*_                                   | Semicolon-delimited list of DCID _uniqueReference_ values. Legacy setting for users that were onboarded manually. _none_ to disable, _\*_ for any user. |
| `ADDRESS_APP_ID`                  | _service-address_                      | DAPR App ID.                                                                                                                                            |
| `FEEDBACK_APP_ID`                 | _service-feedback_                     | DAPR App ID.                                                                                                                                            |
| `GLW_EXPORT_APP_ID`               | _service-green-list-waste-export_      | DAPR App ID.                                                                                                                                            |
| `REFERENCE_DATA_APP_ID`           | _service-reference-data_               | DAPR App ID.                                                                                                                                            |
| `GLW_EXPORT_BULK_APP_ID`          | _service-green-list-waste-export-bulk_ | DAPR App ID.                                                                                                                                            |
| `LIMITED_AUDIENCE_APP_ID`         | _service-limited-audience_             | DAPR App ID.                                                                                                                                            |
| `FEATURE_PRIVATE_AUDIENCE_CHECKS` | _false_                                | Feature flag for checking users' memebership of Private Beta. _true_ or _false_.                                                                        |

[1]: https://developers.google.com/identity/openid-connect/openid-connect#discovery
