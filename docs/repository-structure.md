# Repository Structure

The Waste Tracking Service uses a monorepo, specifically the [integrated style
of monorepo supported by Nx][1].

```
waste-tracking-service/
├── .azure/
│   ├── hub/
│   ├── environment/
│   └── util/
├── .pipelines/
│   ├── templates/
│   ├── pr.yaml
│   └── ci.yaml
├── apps/
│   ├── waste-tracking-service/
│   ├── waste-tracking-gateway/
│   └── annex-vii/
├── libs/
│   ├── waste-tracking-service/
│   ├── annex-vii/
│   │   ├── core/
│   │   └── data/
│   ├── api/
│   │   ├── waste-tracking-gateway/
│   │   └── annex-vii/
│   └── util/
│       └── dapr-winston-logging/
├── test/
│   ├── ui-automation-tests/
│   └── api-automation-tests/
└── docs/
```

The above is only intended to be illustrative.

## Folder Structure

The root of the repository comprises the Nx structure with additional folders
for other non-Node artifacts.

- `.azure` is for Azure resource definitions in [Bicep][2].
  - `hub` and `environment` are _hub_ and _spoke_ deployment configurations.
  - `util` contains Bicep modules shared between multiple deployment
    configurations.
- `.pipelines` contains [YAML Azure Pipeline][3] definitions.
  - `templates` contains [Templates][4] that are used by multiple top-level
    Azure Pipelines.
- `.k8s` contains Kubernetes resource definitions.
- `apps` is part of the [structure of the Nx workspace][5] and these are the
  applications and services that are packaged into containers.
  - A _app_ might be self-contained or a more complex app might aggregate
    modules defined in app-specific libraries in the `libs` directory. This
    second approach is [recommended by Nx][6].
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
  - `util` are general-purpose libraries that can be consumed from anywhere
    else.
- `test` contains automated tests defined in [Ruby][7].
- `docs` is for development-specific documentation in [Markdown][8].

[1]: https://nx.dev/concepts/integrated-vs-package-based#integrated-repos
[2]: https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview
[3]: https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/
[4]: https://learn.microsoft.com/en-us/azure/devops/pipelines/process/templates
[5]: https://nx.dev/more-concepts/applications-and-libraries
[6]: https://nx.dev/more-concepts/applications-and-libraries#mental-model
[7]: https://www.ruby-lang.org/en/
[8]: https://www.markdownguide.org/basic-syntax/
