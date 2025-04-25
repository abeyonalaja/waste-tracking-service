# UK Waste Movements

---

## Frontend styleguide

### Importing components from the GDS react lib

When importing any component from the GDS react library, import them all at once and assign the `GovUK` alias. This namespaces the components, and easily allows you to see where your components come from. Tree shaking will only include used components

Importing
`import * as GovUK from '@wts/ui/govuk-react-ui';`

Usage
`<GovUK.Caption size={'l'}>Caption text</GovUK.Caption>`

### Declaring components

- Use function keyword instead of arrow functions.
- Export the component using a named export (no default keyword)
- Use `interface` instead of `type`
- Name the component props interface using `COMPONENT_NAMEProps`

Example

```
interface InputProps {
  id: string;
  name: string;
  value?: string;
  label?: string;
  hint?: string;
  error?: string;
  testId?: string;
}

export function Input({
  id,
  name,
  value,
  label,
  hint,
  error,
  testId,
}: InputProps) {
  return (
    <FormGroup error={!!error} testId={testId}>
      {label && <Label text={label} inputId={id} />}
      {hint && <Hint text={hint} />}
      {error && <ErrorMessage text={error} />}
      <TextInput id={id} name={name} value={value} error={error} />
    </FormGroup>
  );
}
```

## Environment Settings

| Variable                          | Default                     | Description                                                                                           |
| --------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_GATEWAY_URL`     | _http://localhost:3000/api_ | Server API gateway URL. _http://localhost:3000/api_ or _/api_.                                        |
| `NEXT_PUBLIC_COOKIE_CONSENT_NAME` | _cookieConsent_             | Cookie consent name.                                                                                  |
| `NEXT_PUBLIC_LANGUAGES_ENABLED`   | _false_                     | Feature flag for enabling internationalisation. _true_ or _false_.                                    |
| `NEXT_PUBLIC_UKWM_ENABLED`        | _false_                     | Feature flag for enabling UK Waste Movements multiple upload. _true_ or _false_.                      |
| `SERVICE_CHARGE_ENABLED`          | _false_                     | Feature flag for enabling service charge payments. _true_ or _false_.                                 |
| `UKWM_URL`                        | _/move-waste_               | URL path route for UK Waste Movements application.                                                    |
| `APPINSIGHTS_CONNECTION_STRING`   | N/A                         | [Azure App Insights connection string][1] used for telemetry data collection.                         |
| `DCID_CLIENT_ID`                  | N/A                         | OAuth2 app Client ID.                                                                                 |
| `DCID_CLIENT_SECRET`              | N/A                         | OAuth2 app Client secret.                                                                             |
| `DCID_POLICY`                     | N/A                         | [Azure AD B2C policy][2] of the auth third-party provider.                                            |
| `DCID_REDIRECT`                   | N/A                         | Waste Tracking Service URL where the user will be redirected to after auth with third-party provider. |
| `DCID_SERVICE_ID`                 | N/A                         | Service ID of Waste Tracking in auth third-party provider.                                            |
| `DCID_TENANT`                     | N/A                         | Azure tenant which is hosting the auth third-party provider.                                          |
| `DCID_WELLKNOWN`                  | N/A                         | [OpenID Connect discovery endpoint][3].                                                               |
| `NEXTAUTH_SECRET`                 | N/A                         | Next auth secret.                                                                                     |
| `NEXTAUTH_URL`                    | N/A                         | Waste Tracking Service domain name.                                                                   |

[1]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string?tabs=nodejs
[2]: https://learn.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
[3]: https://developers.google.com/identity/openid-connect/openid-connect#discovery
