# Waste Tracking Service

See the associated [Confluence site][1] for a description of the Waste Tracking
Project and its aims.

## Getting Started

It's worth installing the Nx CLI: `npm install -g nx@latest`, also the [Nx
Console][2] extension for Visual Studio Code.

Run a development server UI:

```
nx serve waste-tracking-service
```

Run a development server API:

```
nx serve mock-gateway
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
