const Scene = require('Scene');
const Autofit = require('./Autofit');
const PickerHandler = require('./PickerHandler');
const Patches = require('Patches');

Scene.root.findFirst('fit_obj_texture').then(plane0 => {
    Scene.root.findFirst('mode').then(mode => {
        PickerHandler.configUsingDafault().then(() => {
            PickerHandler.subscribeIndex(0, () => Autofit.fitTexture(plane0, Autofit.TextureScaleMode.FIT));
            PickerHandler.subscribeIndex(1, () => Autofit.fitTexture(plane0, Autofit.TextureScaleMode.ENVELOPE));
            PickerHandler.subscribeIndex(2, () => Autofit.fitTexture(plane0, Autofit.TextureScaleMode.STRETCH));

            PickerHandler.subscribeKeywords('1', () => Patches.inputs.setBoolean('useFit', true));
            PickerHandler.subscribeKeywords('2', () => Patches.inputs.setBoolean('useFit', false));

            PickerHandler.subscribeIndex(0, () => mode.text = Autofit.TextureScaleMode.FIT);
            PickerHandler.subscribeIndex(1, () => mode.text = Autofit.TextureScaleMode.ENVELOPE);
            PickerHandler.subscribeIndex(2, () => mode.text = Autofit.TextureScaleMode.STRETCH);
        });
    });
});

Scene.root.findFirst('fit_obj_scale').then(plane1 => {
    Autofit.fitObject(plane1, Autofit.ObjectScaleMode.BASED_ON_HEIGHT);
});