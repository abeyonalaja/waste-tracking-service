# Repository Structure

The Waste Tracking Service uses a monorepo, specifically the [integrated style
of monorepo supported by Nx][1].

```
waste-tracking-service/
├── apps/
│   ├── api-mock-gateway/
│   ├── api-waste-tracking-gateway/
│   ├── app-green-list-waste-export/
│   ├── app-uk-waste-movements/
│   ├── app-waste-tracking-service/
│   ├── service-address/
│   ├── service-feedback/
│   ├── service-green-list-waste-export/
│   ├── service-green-list-waste-export-bulk/
│   ├── service-limited-audience/
│   ├── service-payment/
│   ├── service-reference-data/
│   ├── service-uk-waste-movements/
│   ├── service-uk-waste-movements-bulk/
│   └── tool-generate-invitation-token/
├── charts/
│   ├── api-waste-tracking-gateway/
│   ├── app-green-list-waste-export/
│   ├── app-uk-waste-movements/
│   ├── app-waste-tracking-service/
│   ├── service-address/
│   ├── service-feedback/
│   ├── service-green-list-waste-export/
│   ├── service-green-list-waste-export-bulk/
│   ├── service-limited-audience/
│   ├── service-payment/
│   ├── service-reference-data/
│   ├── service-uk-waste-movements/
│   └── service-uk-waste-movements-bulk/
├── docs/
├── libs/
│   ├── api/
│   │   ├── address/
│   │   ├── feedback/
│   │   ├── green-list-waste-export/
│   │   ├── green-list-waste-export-bulk/
│   │   ├── limited-audience/
│   │   ├── payment/
│   │   ├── reference-data/
│   │   ├── uk-waste-movements/
│   │   ├── uk-waste-movements-bulk/
│   │   └── waste-tracking-gateway/
│   ├── app-uk-waste-movements/
│   │   ├── feature-feedback/
│   │   ├── feature-homepage/
│   │   ├── feature-multiples/
│   │   └── feature-single/
│   ├── app-waste-tracking-service/
│   │   └── feature-service-charge/
│   ├── client/
│   │   ├── address/
│   │   ├── feedback/
│   │   ├── green-list-waste-export/
│   │   ├── green-list-waste-export-bulk/
│   │   ├── limited-audience/
│   │   ├── payment/
│   │   ├── reference-data/
│   │   ├── uk-waste-movements/
│   │   └── uk-waste-movements-bulk/
│   ├── ui/
│   │   ├── govuk-react-ui/
│   │   └── shared-ui/
│   └── util/
│       ├── dapr-winston-logging/
│       ├── invocation/
│       └── shared-validation/
├── open-api-documentation/
├── pipelines/
│   ├── charts/
│   ├── templates/
│   ├── vars/
│   ├── acr.yaml
│   ├── ci.yaml
│   ├── nxupdate.yaml
│   ├── nxupgrade.yaml
│   ├── pr.yaml
│   ├── restart.yaml
│   └── tag.yaml
├── scripts/
├── tests/
│   ├── waste-tracking-gateway/
└── └── waste-tracking-service/
```

The above is only intended to be illustrative.

## Folder Structure

The root of the repository comprises the Nx structure with additional folders
for other non-Node artifacts.

- `apps` is part of the [structure of the Nx workspace][2] and these are the
  applications and services that are packaged into containers.
  - A _app_ might be self-contained or a more complex app might aggregate
    modules defined in app-specific libraries in the `libs` directory. This
    second approach is [recommended by Nx][3].
- `charts` contains kubernetes deployment configuration defined using [Helm][4].
- `docs` is for development-specific documentation in [Markdown][5].
- `libs` is the counterpart to `apps` and contains libraries consumed by
  applications and libraries. These libraries can be consumed internally without
  needing to publish them.
  - As mentioned above, as many app-specific libraries as necessary can be
    defined here from a separation-of-concerns perspective. Multiple libraries
    should be nested, for example `libs/my-app/data` for data-access libraries
    and `libs/my-app/feature-a` for a feature library, etc.
  - The contents of `libs/my-app` should obviously only be consumed by
    `apps/my-app`.
  - `api` contains API type-definitions that are statically shared between
    services. For example `libs/api/my-app` contains definitions consumed by
    clients of _my-app_. Sub-directories can also contain data-types for
    messaging channels that aren't owned by any particular service.
  - `client` contains [Dapr][6] client classes that are shared between services.
  - `ui` contains UI type custom components that aren't owned by any particular
    appliction.
  - `util` are general-purpose libraries that can be consumed from anywhere
    else.
- `open-api-documentation` contains [OpenAPI Specification][7].
- `pipelines` contains [YAML Azure Pipeline][8] definitions.
  - `charts` and `vars` contain per environment files for each chart version
    deployed as well as configuration in terms of underlying image version used,
    countainer resource allocation, etc.
  - `templates` contains [Templates][9] that are used by multiple top-level
    Azure Pipelines.
- `scripts` is for [Scripts][10] supporting the development process.
- `tests` contains automated tests defined in [Ruby][11].

[1]: https://nx.dev/concepts/integrated-vs-package-based#integrated-repos
[2]: https://nx.dev/more-concepts/applications-and-libraries
[3]: https://nx.dev/more-concepts/applications-and-libraries#mental-model
[4]: https://helm.sh/
[5]: https://www.markdownguide.org/basic-syntax/
[6]: https://docs.dapr.io/developing-applications/sdks/js/js-client/
[7]: https://swagger.io/specification/v3/
[8]: https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/
[9]: https://learn.microsoft.com/en-us/azure/devops/pipelines/process/templates
[10]: https://docs.npmjs.com/cli/v10/using-npm/scripts
[11]: https://www.ruby-lang.org/en/
