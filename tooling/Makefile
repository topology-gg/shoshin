.PHONY: clean build new_bytecode build_bytecode format

build: clean
	npm run build:wasm && npm i --force && npm run dev

clean:
	rm -fr node_modules .next package-lock.json

format:
	npm run format:fix

new_bytecode:
	cp ../shoshin/compiled_shoshin.json wasm/shoshin/src/bytecode_shoshin.json

build_bytecode:
	npm run build:wasm

update: new_bytecode build_bytecode

build_server :
	npm run build:wasm && npm run build:server && npm pack && cd server && npm install ../next-exp-0.1.0.tgz && npm run build && npm run start


build_server2 :
	npm run build:wasm && npm pack && npm run build:server  && cd server2 && npm install ../next-exp-0.1.0.tgz && npm run build && npm run start