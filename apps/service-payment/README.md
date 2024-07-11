## Third-party dependencies

The service is using OpenAPI specification of Gov.UK Pay API found on: [GitHub][1].

The given specification was used to generate a local type file following the approach described in: [openapi-typescript][2].

The consumption of the third-party dependency is done via: [openapi-fetch][3] and a capability to typecheck can be ran with the following command:

```
nx typecheck service-payment
```

[1]: https://github.com/alphagov/pay-publicapi/blob/master/openapi/publicapi_spec.json
[2]: https://github.com/openapi-ts/openapi-typescript/tree/main/packages/openapi-typescript#basic-usage
[3]: https://github.com/openapi-ts/openapi-typescript/tree/main/packages/openapi-fetch#-setup
