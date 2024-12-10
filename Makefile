PHONY: clean
clean:
	rm -rf node_modules
	rm -rf dist

PHONY: deps
deps:
	npm install --legacy-peer-deps

PHONY: build
build:
	npm run build

PHONY: dev
dev:
	npm run dev

PHONY: watch
watch:
	npm run watch
