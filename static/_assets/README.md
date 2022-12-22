# Assets

If your script has assets (i.e. images), you should place these inside this `_assets` folder. Any directory ending with `_assets` will be hidden from the `Scripts` menu. Use `ui.scriptLocation` to build relative paths.

For example:

```js
const button = new ui.Button("Button");
button.setImage(`${ui.scriptLocation}/_assets/icon.png`);
```

[Source](https://docs.cavalry.scenegroup.co/tech-info/scripting/script-uis)

If you only want to distribute a single script file, you can import the image directly:

```js
import image from "./images/bun.jpg";
const outputPath = "/path/to/output/file.jpg";
api.writeEncodedToBinaryFile(outputPath, image);
```

[Source](https://docs.cavalry.scenegroup.co/tech-info/scripting/api-module#writeencodedtobinaryfilestringfilepath-stringcontent---bool)
