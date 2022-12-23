# caballero

A starter for writing [Cavalry scripts](https://docs.cavalry.scenegroup.co/tech-info/scripting/getting-started/)

## TODO

-   [ ] Add example code to `src/main.js`
-   [ ] Install `cavalry-types` once public
-   [ ] Finalise readme

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

## Cavalry Scripting

Some notes on the scripting environment in Cavalry:

-   Every script has its own scope
-   Scripts can be [encrypted to `.jsc`](https://docs.cavalry.scenegroup.co/tech-info/release-notes/1-4-release-notes#scripting)
-   Javascript engine is [V8 9.0](https://v8.dev/blog/v8-release-90)
-   Ecmascript version is ~[2020 (11.0)](https://262.ecma-international.org/11.0/)
-   No browser APIs beyond [custom implementations](https://github.com/klustre/cavalry-types/types/browser.d.ts)
-   No support for Ecmascript modules

## Development

```
npm install && npm start
```

This will start watching your source files and builds into the `build` folder.

## Release

```
npm run release
```

This will bundle and minify your source files into the `dist` folder.

## Entrypoints

All `.js` and `.ts` files in the root of the `src` folder are considered an entrypoint. Multiple entrypoints will result in multiple scripts being bundled separately, keeping the same name as their entrypoint. If there's a single entrypoint it will be renamed to [`name` from `package.json`](/package.json#L2).

## Debugging

If you're using [VSCode](https://code.visualstudio.com/) you can install the recommended [Stallion](https://marketplace.visualstudio.com/items?itemName=Supasupply.stallion) extension which allows you to send scripts to Cavalry.

Open the bundled script from the `build` or `dist` folder and run the `Send to Cavalry` command. Further details in the [Stallion docs](https://github.com/klustre/stallion#usage).

## Autocompletion

TODO

## Typescript

Caballero is set up for Javascript with type checking enabled. But you can just start using `.ts` files and you're good to go. If you really hate Javascript you can remove `allowJs` and `checkJs` from `tsconfig.json`.

The [esbuild](https://github.com/evanw/esbuild) bundler does not do any type checking. You still have to use [`tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) for that. Please read the [Typescript caveats](https://esbuild.github.io/content-types/#typescript-caveats) that come with using esbuild.

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

Any `jpg` and `png` images are imported as `base64` strings. You can easily add support for other filetypes by adding them to the `loader` list in [`/scripts/build.js`](/scripts/build.js#L39-L42).

## Import Node Modules

You can import Node modules by simply using `import xyz from 'xyz'`. Note that they can't contain browser or Node APIs.

## Static Files

The contents of `/static` will be copied to the `outdir` whenever you run the bundler. This is useful for icons, readme files, etc. Note that any changes in this folder will not be watched, so you need to run the bundler again or save a change in your source files.

The `_assets` folder inside `/static` is ignored by Cavalry. Read [the further details](/static/_assets/).

## Minification

Only whitespaces are removed and variable names are shortened.
