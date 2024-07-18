## Shoshin Tooling

### Setting up dependencies
1. install rustup in order to install the whole Rust toolchain:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. run `rustup install stable` to install the toolchain.

3. run `curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh` to download and install wasm-pack

4. run `make` which will build the Rust into a typescript-wrapped wasm to be used in the webapp, install the nodes modules and launch the webapp on [http://localhost:3000](http://localhost:3000) which you can open to see the result.


### References
- https://github.com/gavinhub/BinaryTree
- http://btv.melezinek.cz/
