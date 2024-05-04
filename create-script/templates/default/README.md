# Template Script for Cavalry

> [!NOTE]
> Did you use this template? We'd love to get a shout out on the product page or in the documentation!
>
> You can use [our badges](https://github.com/scenery-io/create-script/tree/main/images) with a link to [https://scenery.io](https://scenery.io)
>
> <picture>
> 	<source media="(prefers-color-scheme: dark)" srcset="https://github.com/scenery-io/create-script/blob/main/images/Scenery%20Powered%20White.png">
> 	<img alt="Powered by Scenery" src="https://github.com/scenery-io/create-script/blob/main/images/Scenery%20Powered%20Black.png">
> </picture>

## Contents

-   [Cavalry Scripting](#cavalry-scripting)
-   [Development](#development)
-   [Release](#release)
-   [Entrypoints](#entrypoints)
-   [Import Images](#import-images)
-   [Import Node Modules](#import-node-modules)
-   [Import Files as Text](#import-files-as-text)
-   [Static Files](#static-files)
-   [Debugging](#debugging)
-   [Autocompletion](#autocompletion)
-   [Environment Variables](#environment-variables)
-   [TypeScript](#typescript)
-   [Minification](#minification)

## Cavalry Scripting

Some notes on the scripting environment in Cavalry:

-   Every script has its own scope
-   No native support for EcmaScript modules
-   Javascript engine is [V8 9.0](https://v8.dev/blog/v8-release-90)
-   EcmaScript version is ~[2020 (11.0)](https://262.ecma-international.org/11.0/)
-   No browser APIs other than [console](#debugging)
-   Scripts can be encrypted to `.jsc` through the [JavaScript editor](https://docs.cavalry.scenegroup.co/user-interface/menus/window-menu/javascript-editor/) and the [API](https://docs.cavalry.scenegroup.co/tech-info/scripting/api-module/#encrypttexttoencryptstring--string)
-   There's no debugger. Use [console logging](#debugging) instead.

## Development

> [!INFO]
> The `build` folder is automatically symlinked to the Cavalry scripts folder, making it available in the scripts menu. You can find the scripts folder by going to `Help > Show Scripts Folder` in Cavalry.

On the command line run the following command in your script's folder.

```
npm run dev
```

This will start watching your source files and automatically builds into the `build` folder on every file change. Press `Ctrl-C` to stop the watch process.

## Release

On the command line run the following command in your script's folder.

```
npm run release
```

This will bundle, minify and encrypt your script into the `build` folder. A zip file is created in `dist` together with the files from `static/release`.

> [!IMPORTANT]
> Encryption is done through the [Stallion](https://github.com/scenery-io/stallion) script. Make sure it is installed and open in Cavalry when running `npm run release`.

## Entrypoints

All `.js` and `.ts` files in the root of the `src` folder are considered an entrypoint. Multiple entrypoints will result in multiple scripts being bundled separately.

## Import Images

Importing a `.jpg` or `.png` will copy the image to the `Script_assets` folder and import its path. The path includes `ui.scriptLocation` so you can use it directly without needing to create the relative path.

```js
import iconPath from './icons/scenery.png'
// `iconPath` becomes `${ui.scriptLocation}/Script_assets/scenery.png`
const image = new ui.Image(iconPath)
```

## Import Node Modules

Install [Node modules](https://www.npmjs.com/) with

```
npm install [module-name] -D
```

After installing, import the module by using

```js
import Name from 'module-name'
// or
import { thing } from 'module-name'
```

Check the module's documentation to see what can be imported.

> [!IMPORTANT]
> Node modules with any Node- or browser APIs will not work. These APIs are not supported in Cavalry.

## Import Files as Text

Adding a `?text` suffix to the path of an `import` statement will import that file as a string. Note that the contents will be imported as-is.

```js
import expression from './modules/expression.js?text'
api.set('javaScriptShape#1', {
	'generator.expression': expression,
})
```

## Static Files

The contents of the `static/_assets` folder will be copied to the `build` folder. Note that any changes in this folder will not be watched, so you need to run the bundler again or save a change in the code.

> [!TIP]
> Use an `import` statement for images (ie. icons) instead of adding them to `static/_assets`. This comes with a [few benefits](#import-images).

### Release

All files in the `static/release` folder will be added the release zip after running [`npm run release`](#release).

### Assets

The `_assets` folder is ignored by Cavalry and is used for any assets that the script uses. Read [the further details](./static/_assets/).

## Debugging

There is no debugger, so console logging is used instead. The following methods, except for `debug`, are printed to Cavalry's [Message Bar](https://docs.cavalry.scenegroup.co/user-interface/menus/window-menu/message-bar/).

### Log

Typically used in testing. Printed in green.

```ts
console.log(msg: string)
```

### Info

Confirm when something expected has happened. Printed in green.

```ts
console.info(msg: string)
```

### Warn

Warn a user when they've done something unexpected. Printed in yellow.

```ts
console.warn(msg: string)
```

### Error

Flag when something has gone wrong. Printed in red.

```ts
console.error(msg: string)
```

### Debug

Print a message to the console when Cavalry is launched from the command line.

```ts
console.debug(msg: string)
```

On Windows the console is opened on start and remains open.

To open the console on Mac, run this command from the Terminal

```
/Applications/Cavalry.app/Contents/MacOS/Cavalry
```

## Autocompletion

Autocompletion for the Cavalry API is enabled for all JavaScript and TypeScript files inside the `src` folder. This is made possible by the [`cavalry-types`](https://github.com/scenery-io/cavalry-types/). See its [readme](https://github.com/scenery-io/cavalry-types/tree/main?tab=readme-ov-file#cavalry-types) for further details.

## Environment Variables

All variables are replaced by their values at build time.

By default the bundler exposes:

-   `DEVMODE` is `true` when `NODE_ENV` is `development`
-   `PRODUCT_NAME` which is the `name` in [`package.json`](./package.json)
-   `PRODUCT_DISPLAY_NAME` which is the `displayName` in [`package.json`](./package.json)
-   `PRODUCT_VERSION` which is the `version` in [`package.json`](./package.json)

All variables in a `.env` file will be exposed to all JavaScript or TypeScript files in the `src` folder.

> [!CAUTION]
> Never commit a `.env` file to the repo. This may leak your secrets. Use a `.env.example` to note the env variables that are used in the code, without their values.

## TypeScript

This template is set up for JavaScript with type checking enabled. But you can just start using `.ts` files and you're good to go. Remove `allowJs` and `checkJs` from [`tsconfig.json`](./tsconfig.json) to strictly support TypeScript only.

The [esbuild](https://github.com/evanw/esbuild) bundler doesn't do any type checking. You still have to use [`tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) for that. Using TypeScript with `esbuild` comes with some [caveats](https://esbuild.github.io/content-types/#typescript-caveats).

## Minification

Only whitespaces are removed and variable names are shortened.
