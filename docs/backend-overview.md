# Backend Overview

## Structure

The backend for the WTS is comprised of a number of separate services (represented by separate NX projects), each of which is responsible for a different aspect of the application. These services can be split into two groups - public-facing services and internal services. The service-to-service communication is achieved using `dapr`.

The public-facing services are the two gateways. They are responsible for handling incoming requests from the frontend and routing them to the appropriate internal service. The two gateways are the only projects that have the typical RESTful HTTP1.2 based endpoints, while the internal services are invoked via _dapr only_.

The two gateways are:

- `api-waste-tracking-gateway` - a `hapi.js` Web API. It is responsible for handling all the incoming requests and calling the appropriate dapr methods that do the actual work. It is also responsible for handling the authentication and authorization of incoming requests. In addition to that it does some basic schema validation of the incoming requests. Semantically, the gateway is split up into different modules that are responsible for different parts of the waste tracking services (e.g. GLW single journey, service payments, reference data, etc.)

- `api-mock-gateway` - an `express.js` based web API. It is meant to be a light-weight version of the `api-waste-tracking-gateway` that can be used for local development, since it does not require the dapr runtime to be running. It doesn't persist any data or require any underlying services to be running. It is separated the same way as the `api-waste-tracking-gateway`, when it comes to the modules it has and has the same endpoints.

The internal services are:

- `service-address` - a relatively simple service that is responsible for doing address lookup, based on a postcode.
- `service-feedback` - a service that is responsible for sending the feedback that the users provide. This service is used across both GLW and UKWM.
- `service-green-list-waste-export` - the main service responsible for the single journey of GLW. It has all the logic for creating and completing a single GLW record.
- `service-green-list-waste-export-bulk` - the service responsible for the bulk upload of GLW records, using a CSV file. It has all the logic for validating and storing bulk records. It communicates with the `service-green-list-waste-export` to actually create the individual records.
- `service-limited-audience` - a service that handles the user access for the public beta, more specifically it's responsible for redeeming invitations and checking if a given user is part of the public beta.
- `service-payment` - a service that is responsible for handling the payments for the service charges. GOV.UK Pay is used for the actual payment processing.
- `service-reference-data` - a service that is responsible for providing the reference data that is used across the different services. It is responsible for providing the list of countries, the list of waste types, etc.
- `service-uk-waste-movements` - the main service responsible for the single journey of UKWM. It is meant to have all the logic for creating and completing a single UKWM record. This service is not fully implemented - currently, it supports the creation of a movement and populating the following sections of said movement - producer SIC codes, address & contact details, waste collection address & waste source, carrier mode of transport, address & contact details and receiver address & contact details. This service is meant to be the equivalent of the `service-green-list-waste-export` for UKWM.
- `service-uk-waste-movements-bulk` - the service responsible for the bulk upload of UKWM records, using a CSV file. It has all the logic for validating and storing bulk records. It communicates with the `service-uk-waste-movements` to actually create the individual records.

All of the above mentioned projects are found in the `/apps` directory. Each of these projects, also has two libraries associated with it, located in `/libs/api` and `/libs/client`. The `/libs/api` libraries contain type and schema definitions for the requests and responses that are used by the services, while the `/libs/client` libraries contain the clients that are used by the services to communicate with each other.

## Running in development

All the backend services need to be run within dapr and because of that you'd need to have dapr running locally.

Any given service can be run with the command

`dapr run --app-id {APP_NAME} --app-port {APP_PORT} --dapr-http-port {DAPR_HTTP_PORT} --enable-api-logging -- nx serve {APP_NAME}`

For example `dapr run --app-id service-green-list-waste-export --app-port 6009 --dapr-http-port 3609 --enable-api-logging -- nx serve service-green-list-waste-export` would run the `service-green-list-waste-export` service. The app will listen on port `6009` and will expose the `3609` port for dapr to listen on. This way the service can be called directly, which is useful for local development. In most cases, multiple services need to be ran, so the above command would need to be run multiple times with different ports.

# Running tests

Tests can be run with the command `nx run <app or lib name>:test`

For example, `nx run service-uk-waste-movements:test`

Tests can be run for all projects using the command `nx run-many -t test`. It will run all the tests for all the _affected_ projects and will cache the results, so it can be used to validate only what's been changed.

# Running linting

The project has linting setup, using `eslint`

The lining for a specific project be run with the command `nx run <app or lib name>:lint`

For example, `nx run service-uk-waste-movements:lint`

Similar to running the tests, linting can be run for all affected projects with the command `nx run-many -t lint`.

# Running build

A build for a specific project be run with the command `nx run <app or lib name>:build`

For example, `nx run service-uk-waste-movements:build`

Similar to the other commands, building can be run for all affected projects with the command `nx run-many -t build`.

# Running container

A container task for a specific project be run with the command `nx run <app or lib name>:container`

For example, `nx run service-uk-waste-movements:container`

Similar to the other commands, running the container task can be run for all affected projects with the command `nx run-many -t container`.

## Authentication

Both the gateway services expect to receive a JWT bearer token as authentication. The token is validated against DEFRA Customer ID service.

## Monitoring

There are three main places to look for monitoring information:

- Azure Application Insights - here it's easy to see exactly which request has failed and at which stage - for example, if the request has failed at the gateway level, or at the service level and what the response has been.
- AKS Container Logs - this can be used to see the logs of the services and see what has been happening in the service itself.
- Grafana - here it's possible to see the metrics of the services, like the number of requests, the response times, resource usage, etc. This is useful for seeing the overall health of the services.
