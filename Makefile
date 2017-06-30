clean:
	rm -rf node_modules
	rm -rf dist

deps:
	yarn install

serve:
	LOGS_VIEWER_ENV=dev `npm bin`/webpack-dev-server --config webpack.config.js --progress -w

serve_local:
	`npm bin`/webpack-dev-server --config webpack.config.js --progress -w

serve_composer:
	LOGS_VIEWER_ENV=composer `npm bin`/webpack-dev-server --config webpack.config.js --progress -w

serve_dist:
	`npm bin`/webpack-dev-server --env dist --config webpack.config.js --progress -w

run:
	LOGS_VIEWER_ENV=dev `npm bin`/webpack-dev-server --config webpack.config.js --progress

run_local:
	`npm bin`/webpack-dev-server --env local --config webpack.config.js --progress

run_dist:
	`npm bin`/webpack-dev-server --env dist --config webpack.config.js --progress

build:
	LOGS_VIEWER_ENV=dev `npm bin`/webpack --config webpack.config.js

build_local:
	`npm bin`/webpack --config webpack.config.js

build_staging:
	LOGS_VIEWER_ENV=staging `npm bin`/webpack --config webpack.config.js

build_prod:
	LOGS_VIEWER_ENV=prod `npm bin`/webpack --config webpack.config.js

watch:
	LOGS_VIEWER_ENV=dev `npm bin`/webpack-dev-server --config webpack.config.js \
		--progress -w --watch-poll=1000 --watch-aggregate-timeout=500

test:
	yarn test
