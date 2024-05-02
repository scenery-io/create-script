# create-script

A starter template for writing [Cavalry scripts](https://docs.cavalry.scenegroup.co/tech-info/scripting/getting-started/)

> [!NOTE]
> Want to publish your script on [Scenery](https://scenery.io)? Come talk to us on [Discord](https://discord.com/invite/dAmKYcfaff) or [send us a message](https://scenery.io/support)!

## Features

-   Super fast bundling on changes
-   Import EcmaScript and Node modules
-   Encrypt scripts through [Stallion](https://github.com/scenery-io/stallion)
-   Import icons and include them as assets
-   Autocomplete for the whole Cavalry API
-   Package scripts in a zip with assets
-   Bundle multiple scripts together
-   Write in TypeScript or JavaScript

## Quick Start

> [!TIP]
> New to the JavaScript ecosystem? Read our [getting started](./PRIMER.md) guide. The following info assumes you're familiar with [Node](https://nodejs.org/) and [npm](https://www.npmjs.com/).

Create a new script template by running the following command on the command line. This will guide you through creating the template. It requires [Node](https://nodejs.org/) to be installed.

```
npm create @scenery/script@latest
```

Most other package managers such as `yarn` are also supported.

Follow the prompts and run the following command in the newly created folder to start developing.

```
npm run dev
```

## Templates

You will be asked to choose one of the following templates.

### Basic

Best for beginners. It contains the bare minimum to provide all the features.

### Full-featured

Best for more experienced developers. It adds code formatting through [Prettier](https://prettier.io/), a [changelog template](./create-script/templates/default/CHANGELOG.md) and a `.env.example` file.

## Documentation

Further details in the [template readme](./create-script/templates/default/).
