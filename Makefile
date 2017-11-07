clean:
	rm -rf node_modules
	rm -rf dist

deps:
	yarn install

build:
	LOGS_VIEWER_ENV=dev `npm bin`/webpack --config webpack.config.js

build_local:
	`npm bin`/webpack --config webpack.config.js

build_staging:
	LOGS_VIEWER_ENV=staging `npm bin`/webpack --config webpack.config.js

build_prod:
	LOGS_VIEWER_ENV=prod `npm bin`/webpack -p --config webpack.config.js

test:
	yarn test
