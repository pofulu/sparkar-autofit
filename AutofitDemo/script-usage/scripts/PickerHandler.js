const NativeUI = require('NativeUI');
const Textures = require('Textures');
const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');
const Picker = NativeUI.picker;

//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– DEFAULT
const initalIndex = 0;
const texturesName = [
    'img_picker_1',
    'img_picker_2',
    'img_picker_3',
];

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

let currentConfig;
let currentSubscriptions = [];
let subscriptions = [];

function configure(textures, startIndex) {
    currentConfig = {
        selectedIndex: startIndex,
        items: textures.map(i => ({ image_texture: i }))
    };

    Picker.configure(currentConfig)
}

function HandleError(error) {
    Diagnostics.log(error.toString());
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

/**
 * Please set the "DEFAULT" field in `Picker.js`
 * @returns {Promise}
 */
export function configUsingDafault() {
    unsubscribeAll();

    Picker.visible = Reactive.val(true);

    return configUsingNames(texturesName, initalIndex);
}

export function configUsingNames(textureNameArray, startIndex = 0) {
    const removeEmpty = textures => textures.filter(n => n);

    const fetchTextures = textureNameArray.map(name =>
        Textures.findFirst(name).then(result => {
            if (result == undefined) {
                Diagnostics.log(`Error: There is no texture called '${name}'.`);
            } else {
                return result;
            }
        })
    );

    return Promise.all(fetchTextures)
        .then(removeEmpty)
        .then(texs => configure(texs, startIndex))
        .catch(HandleError)
}

/**
 * Please note that the pattern matched result may be with random order
 * @param {string} namePattern 
 * @param {number} startIndex 
 * @returns {Promise<void>}
 */
export function configUsingPattern(namePattern, startIndex = 0, sort = (name1, name2) => name1 - name2) {
    const sortTextuers = results => sort == null ? results : results.sort((a, b) => sort(a.name, b.name));
    const checkLength = results => results.length == 0 ? Promise.reject(`No matching result for pattern ${namePattern}`) : results;

    return Textures.findUsingPattern(namePattern)
        .then(checkLength)
        .then(sortTextuers)
        .then(texs => configure(texs, startIndex))
        .catch(HandleError)
}

/**
 * Please note that Picker's index will **ALWAYS** set to `0` on Facebook when you set visible from `false` to `true`.
 * @param {BoolSignal | boolean} visible 
 */
export function setVisible(visible) {
    Picker.visible = visible;

    if (currentConfig == null) return;

    if (visible) {
        subscriptions.forEach(s => s.unsubscribe());
        subscriptions = [];

        currentSubscriptions.forEach(subscription => {
            switch (subscription.type) {
                case 0: subscribeIndex(subscription.conditions, subscription.event); break;
                case 1: subscribeKeywords(subscription.conditions, subscription.event); break;
                default: break;
            }

            removeItemOnce(currentSubscriptions, subscription);
        })

        Picker.configure(currentConfig);
    } else {
        subscriptions.forEach(s => s.unsubscribe());
        subscriptions = [];
        Picker.configure({ selectedIndex: currentConfig.selectedIndex, items: [] });
    }
}
/**
 * @param {number | ScalarSignal} index
 * @param {{(index: number): void}} callback
 */
export function subscribeIndex(index, callback) {
    currentSubscriptions.push({ type: 0, conditions: index, event: callback });
    const sub = Picker.selectedIndex.eq(index).onOn({ fireOnInitialValue: true }).subscribe(index => {
        currentConfig.selectedIndex = index;
        callback(index);
    });
    subscriptions.push(sub);
    return sub;
}

/**
 * @param {string} textureNameKeyword 
 * @param {{(index: number): void}} callback 
 */
export function subscribeKeywords(textureNameKeyword, callback) {
    currentSubscriptions.push({ type: 1, conditions: textureNameKeyword, event: callback });
    const sub = Picker.selectedIndex.monitor({ fireOnInitialValue: true }).select('newValue').subscribe(index => {
        const indexInRange = index >= 0 && index < currentConfig.items.length;
        if (indexInRange && currentConfig.items[index].image_texture.name.indexOf(textureNameKeyword) !== -1) {
            callback(index)
            currentConfig.selectedIndex = index;
        }
    })
    subscriptions.push(sub);
    return sub;
}

export function unsubscribeAll() {
    subscriptions.forEach(s => s.unsubscribe());
    subscriptions = [];
    currentSubscriptions = [];
}

export function setIndex(toIndex) {
    currentConfig.selectedIndex = toIndex;
    Picker.configure(currentConfig);
}

export default Picker;
