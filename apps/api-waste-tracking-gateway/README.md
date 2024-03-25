## Environment Settings

| Variable                          | Default            | Description                                                                                                                                             |
| --------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DCID_WELLKNOWN`                  | N/A                | [OpenID Connect discovery endpoint][1].                                                                                                                 |
| `DCID_CLIENT_ID`                  | N/A                | OAuth2 app Client ID.                                                                                                                                   |
| `ALLOWED_USERS`                   | _\*_               | Semicolon-delimited list of DCID _uniqueReference_ values. Legacy setting for users that were onboarded manually. _none_ to disable, _\*_ for any user. |
| `ADDRESS_APP_ID`                  | _address_          | DAPR App ID.                                                                                                                                            |
| `FEEDBACK_APP_ID`                 | _feedback_         | DAPR App ID.                                                                                                                                            |
| `ANNEX_VII_APP_ID`                | _annex-vii_        | DAPR App ID.                                                                                                                                            |
| `REFERENCE_DATA_APP_ID`           | _reference-data_   | DAPR App ID.                                                                                                                                            |
| `ANNEX_VII_BULK_APP_ID`           | _annex-vii-bulk_   | DAPR App ID.                                                                                                                                            |
| `LIMITED_AUDIENCE_APP_ID`         | _limited-audience_ | DAPR App ID.                                                                                                                                            |
| `FEATURE_PRIVATE_AUDIENCE_CHECKS` | _false_            | Feature flag for checking users' memebership of Private Beta. _true_ or _false_.                                                                        |

[1]: https://developers.google.com/identity/openid-connect/openid-connect#discovery
