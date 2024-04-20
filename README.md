# Script

A starter for writing [Cavalry scripts](https://docs.cavalry.scenegroup.co/tech-info/scripting/getting-started/)

## Quick Start

Quickly start a new script by running the commands below. Assumes you have Node installed.

```
npm create @scenery my-script
cd my-script
npm install
npm run dev
```

## Contents

-   [Cavalry Scripting](#cavalry-scripting)
-   [Development](#development)
-   [Release](#release)
-   [Entrypoints](#entrypoints)
-   [Debugging](#debugging)
-   [Autocompletion](#autocompletion)
-   [Typescript](#typescript)
-   [Environment Variables](#environment-variables)
-   [Import Files as Text](#import-files-as-text)
-   [Import Images as `base64`](#import-images-as-base64)
-   [Import Node Modules](#import-node-modules)
-   [Static Files](#static-files)
-   [Minification](#minification)

> [!TIP]
> If you're new to the Javascript ecosystem read our [getting started](./GETTING-STARTED.md) guide. The following info assumes you're familiar with [NodeJS](https://nodejs.org/) and [`npm`](https://www.npmjs.com/).

## Cavalry Scripting

Some notes on the scripting environment in Cavalry:

-   Every script has its own scope
-   Javascript engine is [V8 9.0](https://v8.dev/blog/v8-release-90)
-   Ecmascript version is ~[2020 (11.0)](https://262.ecma-international.org/11.0/)
-   No browser APIs other than [console](https://github.com/klustre/cavalry-types/types/browser.d.ts)
-   No native support for Ecmascript modules
-   Scripts can be encrypted to `.jsc` through [the editor](https://docs.cavalry.scenegroup.co/tech-info/scripting/script-uis/#introduction) and [the api](https://docs.cavalry.scenegroup.co/tech-info/scripting/api-module/#encrypttexttoencryptstring--string)

## Development

```
npm run dev
```

This will start watching your source files and automatically builds into the `build` folder on every file change.

## Release

```
npm run release
```

This will bundle and minify your source files into the `dist` folder.

## Entrypoints

All `.js` and `.ts` files in the root of the `src` folder are considered an entrypoint. Multiple entrypoints will result in multiple scripts being bundled separately, keeping the same name as their entrypoint. If there's a single entrypoint it will be renamed to [`name` from `package.json`](/package.json#L2).

## Debugging

<!-- TODO: Note about `console` APIs -->

If you're using [VSCode](https://code.visualstudio.com/) you can install the recommended [Stallion](https://marketplace.visualstudio.com/items?itemName=Supasupply.stallion) extension which allows you to send scripts to Cavalry.

Open the bundled script from the `build` or `dist` folder and run the `Send to Cavalry` command. Further details in the [Stallion docs](https://github.com/klustre/stallion#usage).

## Autocompletion

TODO

## Typescript

This template is set up for Javascript with type checking enabled. But you can just start using `.ts` files and you're good to go. Remove `allowJs` and `checkJs` from [`tsconfig.json`](./tsconfig.json) to strictly support TypeScript only.

The [esbuild](https://github.com/evanw/esbuild) bundler doesn't do any type checking. You still have to use [`tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) for that. Using TypeScript with `esbuild` comes with some [caveats](https://esbuild.github.io/content-types/#typescript-caveats).

## Environment Variables

All variables are replaced by their values upon bundling.

By default the bundler exposes:

-   `DEVMODE` when `NODE_ENV` is `development` or not,
-   `PRODUCT_NAME` which is `name` from `package.json`,
-   `PRODUCT_DISPLAY_NAME` which is `displayName` from `package.json` and
-   `PRODUCT_VERSION` which is `version` from `package.json`

If you have a `.env` file it will automatically expose the variables by their name to all Javascript or Typescript files.

## Import Files as Text

Adding the `?text` suffix to the path of an `import` statement will import the contents of that file as a string. Note that the contents will be imported as-is.

## Import Images as `base64`

Any `jpg` and `png` images are imported as `base64` strings. You can easily add support for other filetypes by adding them to the `loader` list in [`/bin/build.js`](/bin/build.js#L39-L42).

## Import Node Modules

After installing a [Node module](https://www.npmjs.com/), you can import it by simply using `import xyz from 'xyz'`. Note that they can't contain browser or Node APIs.

## Static Files

The contents of `/static` will be copied to the `build` folder. This is useful for icons, readme files, etc. Note that any changes in this folder will not be watched, so you need to run the bundler again or save a change in your source files.

The `_assets` folder inside `/static` is ignored by Cavalry. Read [the further details](/static/_assets/).

## Minification

Only whitespaces are removed and variable names are shortened.
