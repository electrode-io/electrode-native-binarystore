## Electrode Native Binary Store

The [Electrode Native] binary store is a very simple and lightweigtht `NodeJS` file server accessible through an HTTP API.

It can be used with [Electrode Native] for storing/retrieving mobile application versions binaries (APKs for Android, IPAs for iOS), through `ern binarystore` subcommands.

## Installation

1) Install `ern-binarystore` globally on your box 

```bash
$ npm install -g ern-binarystore
```

2) Start the binary store

```bash
$ ern-binarystore
```

## Configuration

The `ern-binarystore` binary accepts some command line options :

`--port`   
The port on which to start the server [`default: 3000`]

`--host`  
The host on which to start the server [`default: localhost`]

`--storePath`  
Path to the directory where the files should be stored

## Setting up for use with Electrode Native

If you want to use [Electrode Native] binary store for your mobile application, you'll need to add the configuration of the binary store to be used, in your mobile application [Cauldron], here is a configuration sample :

```json
"config": {
  "binaryStore": {
    "provider" : "ern-binarystore",
    "url": "http://localhost:3000"
  }
}
```

`provider` : Should be `ern-binarystore`. We will offer support for adding/using more providers in the near future, but as of now, only Electrode Native Binary Store is supported.

`url` : Should be the base url where the binary store server is running

[electrode native]: https://github.com/electrode-io/electrode-native

[cauldron]: https://electrode.gitbooks.io/electrode-native/platform-parts/cauldron.html