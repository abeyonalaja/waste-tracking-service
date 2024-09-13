## Environment Settings

| Variable                          | Default | Description                                                                                                                                             |
| --------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| `DCID_WELLKNOWN`                  | N/A     | [OpenID Connect discovery endpoint][1].                                                                                                                 |
| `DCID_CLIENT_ID`                  | N/A     | OAuth2 app Client ID.                                                                                                                                   |
| `ALLOWED_USERS`                   | _\*_    | Semicolon-delimited list of DCID _uniqueReference_ values. Legacy setting for users that were onboarded manually. _none_ to disable, _\*_ for any user. |
| `FEATURE_PRIVATE_AUDIENCE_CHECKS` | _false_ | Feature flag for checking users' memebership of Private Beta. _true_ or _false_.                                                                        |     |

[1]: https://developers.google.com/identity/openid-connect/openid-connect#discovery
