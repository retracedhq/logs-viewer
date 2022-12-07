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
	LOGS_VIEWER_ENV=prod `npm bin`/webpack --config webpack.config.js

test:
	yarn test

.PHONY: dev
dev:
	docker build -t retraced-logs-viewer-dev .
	docker run --rm -it \
		--name retraced-logs-viewer-dev \
		-p 6012:6012 \
		-v `pwd`:/src \
		retraced-logs-viewer-dev
