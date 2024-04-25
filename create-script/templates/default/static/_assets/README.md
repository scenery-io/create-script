# Assets

If your script has assets (i.e. images), you should place them inside this `_assets` folder. Any directory ending with `_assets` will be hidden from the `Scripts` menu. Use [`ui.scriptLocation`](https://docs.cavalry.scenegroup.co/tech-info/scripting/script-uis/#scriptlocation--string) to build relative paths.

For example:

```js
const button = new ui.Button('Button')
button.setImage(`${ui.scriptLocation}/Script_assets/icon.png`)
```

[Source](https://docs.cavalry.scenegroup.co/tech-info/scripting/script-uis)

## Importing Images

It's recommended to import images (ie. icons) directly into the code. See [import images](../../README.md#import-images) for details.s

<!-- If you only want to distribute a single script file, you can import the image as `base64` and save it to disk on runtime.

```js
import image from "./images/bun.jpg";
const outputPath = "/path/to/output/file.jpg";
api.writeEncodedToBinaryFile(outputPath, image);
```

[Source](https://docs.cavalry.scenegroup.co/tech-info/scripting/api-module#writeencodedtobinaryfilestringfilepath-stringcontent---bool)
-->