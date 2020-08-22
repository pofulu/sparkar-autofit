# Autofit 

**![index](https://github.com/pofulu/sparkar-autofit/blob/master/README.assets/index.gif?raw=true)Autofit** is a Spark AR utility to make object's texture keep in correct ratio. 

Both [Patch](#for-patch-editor) and [Script](#for-script) version are included.

You can also [Click Here to Download Sample Projects](https://yehonal.github.io/DownGit/#home?url=https://github.com/pofulu/sparkar-autofit/tree/master/AutofitDemo). The [PickerHandler](https://github.com/pofulu/sparkar-picker-handler) in script-usage demo projects is not necessary, it's just used to assist in demo.



## For Patch Editor

### Install

0. [Download Autofit.arp](https://raw.githubusercontent.com/pofulu/sparkar-autofit/master/AutofitDemo/patch-usage/patches/Autofit.arp)

1. Drag/Drop or import it to Spark AR

### Usage

![image-20200524193954384](https://github.com/pofulu/sparkar-autofit/blob/master/README.assets/patch-usage.png?raw=true)

#### Input

| Value            | Type    | Description                                                  |
| ---------------- | ------- | ------------------------------------------------------------ |
| Plane Scale      | Vector2 | Generally is the the scale of a **plane'**s transform, or scale of **rectangle**. |
| Texture Size     | Vector2 | The **Dimensions** value of input texture. Find the value and fill it manually. |
| Texture          | Texture | 🖼️                                                            |
| Expand / Shrink  | Boolean | If **true**, the mode is **Expand**. If **false**, the mode is **Shrink**. |
| Background Color | Color   | The background color is filled in the empty space in `ENVELOPE` mode. |

#### Output

| Value  | Type    | Description                                      |
| ------ | ------- | ------------------------------------------------ |
| Output | Texture | The result can be used in material texture slot. |
| UV     | Vector2 | The scaled UV.                                   |



## For Script 

#### Import

0. [Download Autofit.js](https://github.com/pofulu/sparkar-autofit/raw/master/Autofit.js) (Right click and Save as)

1. Drag/Drop or import it to Spark AR.

2. Load in the required module.

    ```javascript
    const Autofit = require('./Autofit');
    // Your script...
    ```


#### npm

0. Add package with `yarn` or `npm`.

    ```shell
    yarn add sparkar-autofit
    ```

    or

    ```shell
    npm i sparkar-autofit
    ```

1. Load in the required module.

    ```javascript
    const Autofit = require('sparkar-autofit');
    // Your script...
    ```

### Usage 

```javascript
const Scene = require('Scene');
const Autofit = require('./Autofit');

Scene.root.findFirst('plane0').then(plane0 =>
   Autofit.fitTexture(plane0, Autofit.TextureScaleMode.FIT))
);

Scene.root.findFirst('plane0').then(plane0 =>
   Autofit.fitObject(plane0, Autofit.ObjectScaleMode.BASED_ON_HEIGHT))
);

```

### Reference

#### `Autofit`

| **Method**                                                   | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `fitTexture(sceneObject: SceneObjectBase, scaleMode: Autofit.TextureScaleMode, backgroundColor: Point4DSignal): Promise<void>` | Fit object's texture scale in ratio.                         |
| `getFitTextureUV(sceneObject: SceneObjectBase, scaleMode: Autofit.TextureScaleMode): Promise<ScaleSignal>` | Get the ScaleSignal that for object to fit scale by texture's ratio. |
| `fitObject(sceneObject: SceneObjectBase, scaleMode: Autofit.ObjectScaleMode): Promise<void>` | Fit object's scale by texture's ratio.                       |
| `getFitObjectScale(sceneObject: SceneObjectBase, scaleMode: Autofit.ObjectScaleMode): Promise<ScaleSignal>` | Get the ScaleSignal that for object to fit scale by texture's ratio. |

#### `Autofit.ObjectScaleMode`

| **Value** | Description                                                  |
| ---------- | --------- |
| `BASED_ON_HEIGHT` | Scale based on height mode. |
| `BASED_ON_WIDTH` | Scale based on width mode. |
| `BASED_ON_1024` | Scale based on resolution 1024 mode. |

#### `Autofit.TextureScaleMode`

| **Value** | Description                                                  |
| ---------- | --------- |
| `Expand` | Scale in expand mode. |
| `Shrink` | Scale in shrink mode. |
| `Stretch` | Scale in strech mode. |

## Donations

If this is useful for you, please consider a donation🙏🏼. One-time donations can be made with PayPal.

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HW99ESSALJZ36)

