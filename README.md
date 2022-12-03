# fvm DID Resolver

The fvm resolver library is used for resolving DID’s in fvm Method Space. The module is supposed to be used as an integration to fvm library.

## Install

```
npm install
```

## Usage

In combination with the DID-Resolver:

```js
import { resolveDID } from "fvm-did-resolver";
const didDocument = await resolveDID(did);
```
The function returns a DID Document.

## Testing

For testing use the command

```
npm run test
```
