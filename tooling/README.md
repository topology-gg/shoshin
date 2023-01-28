## Shoshin Tooling

### Setting up dependencies
1. install rustup in order to install the whole Rust toolchain:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. run `rustup install stable` to install the toolchain.

3. run `curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh` to download and install wasm-pack

4. go into ./wasm and run `cargo build` to pull and build all dependencies, most important among all being cairo-rs.

5. `npm run build:wasm` to build a typescript-wrapped wasm to be used in the webapp. This step may take a few minutes and without verbosity setup there won't be logs coming to the screen.

6. run `npm install --force` or `yarn install` in order to install the node modules

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### References
- https://github.com/gavinhub/BinaryTree
- http://btv.melezinek.cz/
