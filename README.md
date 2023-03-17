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

### Customization `fields` Prop

The `fields` prop of the `RetracedEventsBrowser` component is used to customize the columns that are displayed in the table. It is an array of objects, where each object represents a column and has the following properties:

- `label (string)`: The header to be shown for the column.
- `type (string, optional)`: The type of data in the cells. The possible values are "string" & "markdown". If this property is not provided, the type is assumed to be "string".
- `field (string, optional)`: The name of the field in the event object that should be displayed in the column.
- `getValue (function, optional)`: A function that takes the event object as input and returns the value to be displayed in the column. This property can be used to programmatically extract value for cell based on the event object.
- `style (object, optional)`: JSX style object to apply custom styles to the cells.

Note that either `field` or `getValue` has to be provided to display data. In case both are provided priority is given to the `getValue`.

For the `Group`, `Target`, and `Actor` fields, which are of type object, you can use dot notation to get the string value of the desired subfield. For example, you can use `actor.name` to display the name of the actor. If the name is empty, the next relevant field will be used as a fallback. If you do not specify a subfield, the component will automatically pick the correct value to display, using the following preference order: `name` > `id` > `type` (only for target).

```javascript
<RetracedEventsBrowser
  host={`http://localhost:3000/auditlog/viewer/v1`}
  auditLogToken={viewerToken}
  header="Audit Logs"
  fields={[
    {
      label: "Description",
      type: "markdown",
      field: "display.markdown",
    },
    {
      label: "Date",
      field: "canonical_time",
    },
    {
      label: "Actor",
      field: "actor",
    },
    {
      label: "CRUD",
      field: "crud",
    },
    {
      label: "Location",
      getValue: (event) => {
        return event.country || event.source_ip;
      },
    },
  ]}
  customClass={"text-primary dark:text-white"}
/>
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
