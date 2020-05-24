const Scene = require('Scene');
const PickerHandler = require('./PickerHandler');
const Patches = require('Patches');

Scene.root.findFirst('mode').then(mode => {
    PickerHandler.configUsingDafault().then(() => {
        PickerHandler.subscribeKeywords('1', () => Patches.inputs.setBoolean('useFit', true));
        PickerHandler.subscribeKeywords('2', () => Patches.inputs.setBoolean('useFit', false));
        PickerHandler.subscribeIndex(0, () => mode.text = 'FIT');
        PickerHandler.subscribeIndex(1, () => mode.text = 'ENVELOPE');
    });
});