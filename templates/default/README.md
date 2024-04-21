# Default Template

A starter template for writing [Cavalry scripts](https://docs.cavalry.scenegroup.co/tech-info/scripting/getting-started/)

> [!TIP]
> If you're new to the Javascript ecosystem read our [getting started](./GETTING-STARTED.md) guide. The following info assumes you're familiar with [Node](https://nodejs.org/) and [npm](https://www.npmjs.com/).

## Quick Start

Create a new script template by running the following command on the commandline. This will guide you through creating the template. It requires [Node](https://nodejs.org/) to be installed.

```
npm create @scenery/script my-script
```

Follow the prompts and run the following command to start developing.

```
cd my-script && npm run dev
```

## Contents

-   [Cavalry Scripting](#cavalry-scripting)
-   [Development](#development)
-   [Release](#release)
-   [Entrypoints](#entrypoints)
-   [Autocompletion](#autocompletion)
-   [Environment Variables](#environment-variables)
-   [Import Files as Text](#import-files-as-text)
-   [Import Images](#import-images)
-   [Import Node Modules](#import-node-modules)
-   [Static Files](#static-files)
-   [Debugging](#debugging)
-   [Typescript](#typescript)
-   [Minification](#minification)

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

All `.js` and `.ts` files in the root of the `src` folder are considered an entrypoint. Multiple entrypoints will result in multiple scripts being bundled separately, keeping the same name as their entrypoint.

## Autocompletion

TODO

## Environment Variables

All variables are replaced by their values upon bundling.

By default the bundler exposes:

-   `DEVMODE` is `true` when `NODE_ENV` is `development`
-   `PRODUCT_NAME` which is the `name` in `package.json`
-   `PRODUCT_DISPLAY_NAME` which is the `displayName` in `package.json`
-   `PRODUCT_VERSION` which is the `version` in `package.json`

A `.env` file in the root will automatically expose its variables to all Javascript or Typescript files in the `src` folder.

## Import Images

Importing an image (.png/.jpg) will copy it to the assets folder and import the path. Use the variable to construct the path to the image.

```js
import icon from './icons/scenery.png'
const iconPath = `${ui.scriptLocation}/${icon}`
const icon = new ui.Image(imagePath)
```

## Import Node Modules

After installing a [Node module](https://www.npmjs.com/), you can import it by using `import xyz from 'xyz'`. Note that they can't contain browser- or Node APIs.

## Import Files as Text

Adding the `?text` suffix to the path of an `import` statement will import that file as a string. Note that the contents will be imported as-is.

```js
import expression from './modules/expression.js?text'
api.set('javaScriptShape#1', {
	'generator.expression': expression,
})
```

<!-- ## Import Images as `base64`

Any `jpg` and `png` images are imported as `base64` strings. You can easily add support for other filetypes by adding them to the `loader` list in [`/bin/build.js`](/bin/build.js#L39-L42). -->

## Static Files

The contents of the `static` folder will be copied to the `build` folder. This is useful for readme files, etc. Note that any changes in this folder will not be watched, so you need to run the bundler again or save a change in your source files.

The `_assets` folder inside `static` is ignored by Cavalry. Read [the further details](/static/_assets/).

## Debugging

<!-- TODO: Note about `console` APIs -->

## Typescript

This template is set up for Javascript with type checking enabled. But you can just start using `.ts` files and you're good to go. Remove `allowJs` and `checkJs` from [`tsconfig.json`](./tsconfig.json) to strictly support TypeScript only.

The [esbuild](https://github.com/evanw/esbuild) bundler doesn't do any type checking. You still have to use [`tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) for that. Using TypeScript with `esbuild` comes with some [caveats](https://esbuild.github.io/content-types/#typescript-caveats).

## Minification

Only whitespaces are removed and variable names are shortened.
