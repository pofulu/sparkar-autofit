const Patches = require('Patches');
const PickerHandler = require('./PickerHandler');
const Textures = require('Textures');
const Reactive = require('Reactive');
const Scene = require('Scene');

Textures.findFirst('galleryTexture0').then(galleryTexture => {
    Patches.inputs.setPoint2D('galleryTextureSize', Reactive.point2d(galleryTexture.width, galleryTexture.height));
})

Scene.root.findFirst('mode').then(mode => {
    PickerHandler.configUsingDafault().then(() => {
        PickerHandler.subscribeKeywords('1', () => mode.text = 'FIT');
        PickerHandler.subscribeKeywords('2', () => mode.text = 'ENVELOPE');

        PickerHandler.subscribeKeywords('1', () => Patches.inputs.setBoolean('useFit', true));
        PickerHandler.subscribeKeywords('2', () => Patches.inputs.setBoolean('useFit', false));
    });
});