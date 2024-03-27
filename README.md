# Waste Tracking Service

See the associated [Confluence site][1] for a description of the Waste Tracking
Project and its aims.

## Getting Started

It's worth installing the Nx CLI: `npm install -g nx@latest`, also the [Nx
Console][2] extension for Visual Studio Code.

Run a development server UI:

- For Waste Tracking Service parent application:

```
nx serve app-waste-tracking-service
```

- For Green List Waste Export child application:

```
nx serve app-green-list-waste-export
```

- For UK Waste Movements child application:

```
nx serve app-uk-waste-movements
```

Run a development server API:

```
nx serve mock-gateway
```

Run a development server UI together with development server API:

- For Green List Waste Export child app:

```
nx serve-both app-green-list-waste-export
```

## Nx Workspace

The repository comprises an Nx _integrated_ monorepo, so see the [Nx
documentation][3] with respect to how to manage this.

Run `nx graph` to see a diagram of the dependencies of the projects.

[1]: https://eaflood.atlassian.net/wiki/spaces/WTPG/overview
[2]: https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console
[3]: https://nx.dev/

To get this running locally you will need a .env.local containing

NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3000/api

## Naming conventions

The repository structure comprises of source code, libraries, as well as CI configuration for underlying frontend and backend components that follow predefined naming conventions.

Source code is contained within `/apps` folder with the following conventions:

- Public facing services prefixed with `api-`
- UI applications prefixed with `app-`
- Internal microservices prefixed with `service-`
- Internal tools not exposed for API consumption prefixed with `tool-`

Where all relevant CI configuration is named analogously.

Library code is contained within `/libs` folder with the following conventions:

- API libraries contained within `/api` folder
- Client libraries contained within `/client` folder
- UI libraries contained within `/ui` folder
- Utility libraries contained within `/util` folder

Where all library type projects are named as `lib-<LIBRARY_TYPE>-<LIBRARY_NAME>`, for example:

```
lib-api-address
```

For more comprehensive view of the full repository structure see [docs][4].

[4]: https://dev.azure.com/defragovuk/DEFRA-WTS-Waste-Tracking-Service/_git/waste-tracking-service?path=/docs/repository-structure.md
