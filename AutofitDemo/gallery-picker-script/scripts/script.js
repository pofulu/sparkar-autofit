const Scene = require('Scene');
const Autofit = require('./Autofit');
const PickerHandler = require('./PickerHandler');

Scene.root.findFirst('fit_texture').then(plane => {
    Scene.root.findFirst('mode').then(mode => {
        PickerHandler.configUsingDafault().then(() => {
            PickerHandler.subscribeIndex(0, () => Autofit.fitTexture(plane, Autofit.TextureScaleMode.FIT));
            PickerHandler.subscribeIndex(1, () => Autofit.fitTexture(plane, Autofit.TextureScaleMode.ENVELOPE));
            PickerHandler.subscribeIndex(2, () => Autofit.fitTexture(plane, Autofit.TextureScaleMode.STRETCH));

            PickerHandler.subscribeIndex(0, () => mode.text = Autofit.TextureScaleMode.FIT);
            PickerHandler.subscribeIndex(1, () => mode.text = Autofit.TextureScaleMode.ENVELOPE);
            PickerHandler.subscribeIndex(2, () => mode.text = Autofit.TextureScaleMode.STRETCH);
        });
    });
});