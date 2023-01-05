# Retraced Embedded Logs Viewer

A React library for viewing Retraced logs.

## Installation

### yarn

```shell
$ yarn add @retracedhq/logs-viewer
```

### npm

```shell
$ npm i -s @retracedhq/logs-viewer
```

### Usage (React)

```javascript
<RetracedEventsBrowser
  host={`http://localhost:3000/auditlog/viewer/v1`}
  auditLogToken={viewerToken}
  header="Audit Logs"
  customClass={"text-primary dark:text-white"}
/>
```

You will need to fetch the viewer token on the server side using our [Node.js SDK](https://github.com/retracedhq/retraced-js) (or use our API call to generate one).

```javascript
  const retraced = new Retraced.Client({
    apiKey: <Retraced Token>,
    projectId: <Retraced Project ID>,
    endpoint: 'http://localhost:3000/auditlog',
    viewLogAction: 'audit.log.view',
  });

  const viewerToken = await retraced.getViewerToken(<Group ID>, 'My SaaS app', false);
```

## Local development

Make sure you are running (Retraced)[https://github.com/retracedhq/retraced] with the `dev` project and token bootstrapped.

```sh
# Install dependencies
make deps

# Run local dev server
make dev
```

## Embedded local development

**Run from root of this project**

```sh
# Install dependencies
make deps

# Create a project link, may be npm or yarn
npm link # or yarn link

# Run the build on watch mode
make watch
```

**Run from root of dependent project**

```sh
# Create a project link, may be npm or yarn
npm link # or yarn link

# -or-

# Install the linked library
npm link retraced-logs-viewer # or yarn link retraced-logs-viewer
```

Then follow development instructions for the dependent project. Changes to the logs viewer should reflect in the consuming project in realtime.
