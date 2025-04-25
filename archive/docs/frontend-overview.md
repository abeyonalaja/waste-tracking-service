# Frontend Overview

## Structure

The frontend of WTS is split across three separate Next.js apps:

- `app-waste-tracking-service` uses Next App router and contains the landing page for the service, account page, and the service-charge payment journey.
- `app-uk-waste-movements` uses Next App router contains the single and multiple (CSV upload) creation journys for UK waste movements.
- `app-green-list-waste-export` uses Next Pages router and contains the single and multiple (CSV upload) journys for Green List waste exports.

All code (pages/components/tests) for `app-green-list-waste-export` is largely contained within this directory.

Pages and routing code for `app-uk-waste-movements` and `app-waste-tracking-service` is is found within their respective directories, and feature code (components/tests/utils) is found within their respective directories in `/libs`.

## Running in development

The frontend for any project can be run locally with the command `nx serve <app name>` e.g. `nx serve app-uk-waste-movements` serves this app on `localhost:4200`

The `--port=XXXX` flag can be used to serve another app simultaniously.

The frontend apps can be run against the JSON Server mock-backend started with `nx serve api-mock-gateway`.

# Running tests

Tests can be run with the command `nx run <app or lib name>:test`

For example, `nx run app-green-list-waste-export:test`

## Components

`app-green-list-waste-export` uses [govuk-react](https://github.com/govuk-react/govuk-react) for GDS components. However as this package has a dependency upon [styled-components](https://www.npmjs.com/package/styled-components) which is incompatable with Next.js App router `app-waste-tracking-service` and `app-uk-waste-movements` use an internal implementation found in `libs/ui/govuk-react-ui`.

Other shared components can be found in `libs/ui/shared-ui`

## Authentication

[next-auth](https://www.npmjs.com/package/next-auth) is used across all three frontend apps for authentication. Default sign-out time is 15 minutes of inactivity.

## Internationalisation

`app-green-list-waste-export` uses [react-i18next](https://www.npmjs.com/package/react-i18next) for internationalisation and strings can be found in `apps/app-green-list-waste-export/i18n`.

This package is incompatable with Next.js App router and React server components so `app-waste-tracking-service` and `app-uk-waste-movements` use [next-intl](https://www.npmjs.com/package/next-intl). Message strings for these are found in the `/messages` directory in the root of each project.

## Monitoring

Azure Application Insights has been integrated on both client and server-side of `app-green-list-waste-export` and `app-uk-waste-movements` but this work still needs to be completed on `app-waste-tracking-service`.
