# Waste Tracking Service

See the associated [Confluence site][1] for a description of the Waste Tracking
Project and its aims.

## Getting Started

It's worth installing the Nx CLI: `npm install -g nx@latest`, also the [Nx
Console][2] extension for Visual Studio Code.

For more comprehensive view of the full list of tools see [docs][3].

### Nx Workspace

The repository comprises an Nx _integrated_ monorepo, so see the [Nx
documentation][4] with respect to how to manage this.

Run `nx graph` to see a diagram of the dependencies of the projects.

### UI

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

Run a development server UI together with development server API:

- For Waste Tracking Service parent application:

```
nx serve-both app-waste-tracking-service
```

- For Green List Waste Export child app:

```
nx serve-both app-green-list-waste-export
```

- For UK Waste Movements child application:

```
nx serve-both app-uk-waste-movements
```

To get these running locally you will need a _.env.local_ file added to the relevant app root folder containing:

```
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3000/api
```

### API

Run a development server API:

```
nx serve api-mock-gateway
```

### Dapr services

[Dapr CLI][5] and [Docker Desktop][6] installations are required for running any server related services.

Run a production server API:

```
dapr run --app-id api-waste-tracking-gateway --enable-api-logging -- nx run api-waste-tracking-gateway:serve:production
```

Run an internal service:

```
dapr run --app-id <SERVICE_NAME> --app-port <APP_PORT> --dapr-http-port <HTTP_PORT> --enable-api-logging -- nx serve <SERVICE_NAME>
```

## Naming conventions

The repository structure comprises of source code, libraries, as well as CI configuration for underlying frontend and backend components that follow predefined naming conventions.

Source code is contained within `/apps` folder with the following conventions:

- Public facing services prefixed with `api-`
- UI applications prefixed with `app-`
- Internal services prefixed with `service-`
- Internal tools not exposed for API consumption prefixed with `tool-`

Where CI configuration is named analogously and applicable to:

- All UI applications
- All internal services
- The public facing service `api-waste-tracking-gateway`

Library code is contained within `/libs` folder with the following conventions:

- API libraries contained within `/api` folder
- UI app specific feature libraries contained within folders `/app-<APP_NAME>`
- Client libraries contained within `/client` folder
- UI libraries contained within `/ui` folder
- Utility libraries contained within `/util` folder

Where all library type projects are named as `lib-<LIBRARY_TYPE>-<LIBRARY_NAME>`, for example:

```
lib-api-address
```

And UI app specific feature library type projects are named as `lib-<LIBRARY_TYPE>-<APP_NAME>-feature-<FEATURE_NAME>`, for example:

```
lib-app-uk-waste-movements-feature-homepage
```

For more comprehensive view of the full repository structure see [docs][7].

[1]: https://eaflood.atlassian.net/wiki/spaces/WTPG/overview
[2]: https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console
[3]: https://dev.azure.com/defragovuk/DEFRA-WTS-Waste-Tracking-Service/_git/waste-tracking-service?path=/docs/tooling.md
[4]: https://nx.dev/
[5]: https://docs.dapr.io/getting-started/install-dapr-cli/
[6]: https://docs.docker.com/desktop/
[7]: https://dev.azure.com/defragovuk/DEFRA-WTS-Waste-Tracking-Service/_git/waste-tracking-service?path=/docs/repository-structure.md
