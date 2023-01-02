# Retraced Embedded Logs Viewer
A React library for viewing Retraced logs.

## Local development
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
