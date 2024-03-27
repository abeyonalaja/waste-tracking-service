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
│   ├── service-reference-data/
│   ├── service-uk-waste-movements/
│   └── service-uk-waste-movements-bulk/
├── libs/
│   ├── api/
│   │   ├── address/
│   │   ├── common/
│   │   ├── feedback/
│   │   ├── green-list-waste-export/
│   │   ├── green-list-waste-export-bulk/
│   │   ├── limited-audience/
│   │   ├── reference-data/
│   │   ├── uk-waste-movements/
│   │   └── uk-waste-movements-bulk/
│   ├── client/
│   │   ├── address/
│   │   ├── feedback/
│   │   ├── green-list-waste-export/
│   │   ├── green-list-waste-export-bulk/
│   │   ├── limited-audience/
│   │   ├── reference-data/
│   │   ├── uk-waste-movements/
│   │   └── uk-waste-movements-bulk/
│   ├── ui/
│   │   └── govuk-react-ui/
│   └── util/
│       ├── dapr-winston-logging/
│       └── invocation/
├── pipelines/
│   ├── templates/
│   ├── vars/
│   ├── acr.yaml
│   ├── ci.yaml
│   ├── pr.yaml
│   ├── restart.yaml
│   └── tag.yaml
├── tests/
│   ├── waste-tracking-gateway/
│   └── waste-tracking-service/
└── docs/
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
  - `client` contains [Dapr][5] client classes that are shared between services.
  - `ui` contains UI type custom components that aren't owned by any particular
    appliction.
  - `util` are general-purpose libraries that can be consumed from anywhere
    else.
- `pipelines` contains [YAML Azure Pipeline][6] definitions.
  - `templates` contains [Templates][7] that are used by multiple top-level
    Azure Pipelines.
- `tests` contains automated tests defined in [Ruby][8].
- `docs` is for development-specific documentation in [Markdown][9].

[1]: https://nx.dev/concepts/integrated-vs-package-based#integrated-repos
[2]: https://nx.dev/more-concepts/applications-and-libraries
[3]: https://nx.dev/more-concepts/applications-and-libraries#mental-model
[4]: https://helm.sh/
[5]: https://docs.dapr.io/developing-applications/sdks/js/js-client/
[6]: https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/
[7]: https://learn.microsoft.com/en-us/azure/devops/pipelines/process/templates
[8]: https://www.ruby-lang.org/en/
[9]: https://www.markdownguide.org/basic-syntax/
