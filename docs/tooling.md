# Tooling

Our choice of tools and frameworks is a product of project-specific concerns and
Defra's [software development standards][1].

## Platforms

- [Node.js][2] is Defra's preferred runtime for digital services.

- [Docker][3] is used as a toolchain for local development with Linux
  containers.

- [Dapr][4] is a framework for building distributed applications and backend
  services should use Dapr for service discovery, service invocation,
  publish-subscribe communcation and for state and secret management.

  - This can be valuable when developing services locally whereby Azure
    components can be replaced with containerised equivalents. Dapr provides
    a [CLI][5] that is useful for local-development.

  - This includes the use of [CloudEvents][6] for event descriptions.

## Frontend

- [Next.js][7] is our framework for building all frontend web-apps.

- [React][8] is our UI framework for frontend web-apps.

  - For Government Services, [_govuk-react_][9] is used as an implementation of
    the GOV.UK Design System.

## Backend

- [Hapi][10] is Defra's preferred framework for building web-services and as
  such all external-facing services should use this. Note that:

  1. Whilst Next.js also can be used to define API endpoints and this might be
     preferable in several ways, we should use Hapi for this purpose to adhere
     to Defra standards.

  1. Backend services are only available via Dapr and as such should use the
     Dapr SDK to provide an interface.

- [OpenTelemetry][11] is our observability framework and we should use the
  [W3C Trace Context][12] ubiquitously. This is relatively straightforward with
  OpenTelemetry SDKs and auto-instrumentation:

  - OpenTelemetry provides a [Node SDK][13].
  - The [OpenTelemetry Registry][14] has auto-instrumentation packages that
    cover Hapi, as well as HTTP and gRPC clients and servers.
  - A _trace exporter_ is [provided for Azure Monitor][15].

## Development

- [Nx][16] is used to support a monorepo for our Node.js services. In particular
  it is an [_integrated_ style][17] Nx workspace that is used.

- [TypeScript][18] is our target language.

- [Prettier][19] is used to define the format of all files according to a global
  _.prettierrc_ file at the root of the repository. Prettier is integrated with
  Nx such that `nx format:check` and `nx format:write` will handle this
  globally.

- [Jest][20] is our unit-testing framework. All projects have a Jest-based
  `test` target so for instance `nx run-many --target=test` will run all tests
  for all projects.

- [ESLint][21] is our linting utility. All projects have a ESLint-based
  `lint` target so for instance `nx run-many --target=lint` will analyzes all
  code to quickly find problems for all projects.

## Continuous Integration

- [Helm][22] is used to manage our [Kubernetes][23] applications.

- [YAML][24] is our target language.

[1]: https://github.com/DEFRA/software-development-standards
[2]: https://nodejs.org/en/
[3]: https://www.docker.com/
[4]: https://dapr.io/
[5]: https://docs.dapr.io/getting-started/install-dapr-cli/
[6]: https://cloudevents.io/
[7]: https://nextjs.org/
[8]: https://reactjs.org/
[9]: https://github.com/govuk-react/govuk-react
[10]: https://hapi.dev/
[11]: https://opentelemetry.io/
[12]: https://www.w3.org/TR/trace-context/
[13]: https://www.npmjs.com/package/@opentelemetry/sdk-node
[14]: https://opentelemetry.io/ecosystem/registry/?s=&component=instrumentation&language=js
[15]: https://learn.microsoft.com/en-us/javascript/api/overview/azure/monitor-opentelemetry-exporter-readme
[16]: https://nx.dev/
[17]: https://nx.dev/concepts/integrated-vs-package-based#integrated-repos
[18]: https://www.typescriptlang.org/
[19]: https://prettier.io/
[20]: https://jestjs.io/
[21]: https://eslint.org/
[22]: https://helm.sh/
[23]: https://kubernetes.io/
[24]: https://yaml.org/
