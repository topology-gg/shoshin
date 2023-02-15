.PHONY: clean build

build: clean
	npm run build:wasm && npm i --force && npm run dev

clean:
	rm -fr node_modules .next package-lock.json