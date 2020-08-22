const Autofit = require('./Autofit');

const Scene = require('Scene');
const Reactive = require('Reactive');
const PickerHandler = require('./PickerHandler');

Scene.root.findFirst('fit_obj_texture').then(plane => {
    Scene.root.findFirst('mode').then(mode => {
        PickerHandler.setVisible(true);
        PickerHandler.configUsingPattern('picker_*').then(() => {
            PickerHandler.subscribeKeywords('expand', () => { Autofit.fitTexture(plane, Autofit.TextureScaleMode.Expand) });
            PickerHandler.subscribeKeywords('expand', () => mode.text = Autofit.TextureScaleMode.Expand);

            PickerHandler.subscribeKeywords('shrink', () => Autofit.fitTexture(plane, Autofit.TextureScaleMode.Shrink, Reactive.pack4(0, 0, 1, 0.3)));
            PickerHandler.subscribeKeywords('shrink', () => mode.text = Autofit.TextureScaleMode.Shrink);

            PickerHandler.subscribeKeywords('stretch', () => Autofit.fitTexture(plane, Autofit.TextureScaleMode.Stretch));
            PickerHandler.subscribeKeywords('stretch', () => mode.text = Autofit.TextureScaleMode.Stretch);
        });
    });
});
Scene.root.findFirst('fit_obj_scale').then(plane1 => {
    Autofit.fitObject(plane1, Autofit.ObjectScaleMode.BASED_ON_HEIGHT);
});