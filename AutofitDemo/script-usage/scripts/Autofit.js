const Reactive = require('Reactive');
const Shaders = require('Shaders');
const Diagnostics = require('Diagnostics');

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

const uv = Shaders.fragmentStage(Shaders.vertexAttribute({ variableName: 'TEX_COORDS' }));

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

/**
 * @param {ShaderSignal} uv 
 * @param {Point2DSignal} scale 
 * @return {Point2DSignal}
 */
function scaleUV(uv, scale) {
    const scaleAxis = (axis, scale) => {
        scale = Reactive.div(1, scale);
        return axis.mul(scale).sub(scale.sub(1).mul(0.5));
    }
    const scaledU = scaleAxis(uv.x, scale.x);
    const scaledV = scaleAxis(uv.y, scale.y);

    return Reactive.pack2(scaledU, scaledV);
}

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

/** @enum {string} */
export const ObjectScaleMode = {
    BASED_ON_HEIGHT: 'BASED_ON_HEIGHT',
    BASED_ON_WIDTH: 'BASED_ON_WIDTH',
    BASED_ON_1024: 'BASED_ON_1024',
}

/** @enum {string} */
export const TextureScaleMode = {
    FIT: 'FIT',
    ENVELOPE: 'ENVELOPE',
    STRETCH: 'STRETCH'
}

/**
 * @param {SceneObjectBase} sceneObject 
 * @param {ObjectScaleMode} scaleMode `AutoFit.ObjectScaleMode`
 * @returns {Promise<ScaleSignal>}
 */
export function getFitObjectScale(sceneObject, scaleMode) {
    return sceneObject.getMaterial().then(mat =>
        mat.getDiffuse().then(tex => {
            switch (scaleMode) {
                case ObjectScaleMode.BASED_ON_HEIGHT:
                    var scale = Reactive.scale(
                        tex.width.div(tex.height).mul(sceneObject.transform.scaleX.pinLastValue()),
                        sceneObject.transform.scaleY.pinLastValue(),
                        sceneObject.transform.scaleZ.pinLastValue()
                    );
                    break;

                case ObjectScaleMode.BASED_ON_WIDTH:
                    var scale = Reactive.scale(
                        sceneObject.transform.scaleX.pinLastValue(),
                        tex.height.div(tex.width).mul(sceneObject.transform.scaleY.pinLastValue()),
                        sceneObject.transform.scaleZ.pinLastValue()
                    );
                    break;

                case ObjectScaleMode.BASED_ON_1024:
                    var scale = Reactive.scale(
                        tex.width.div(1024).mul(sceneObject.transform.scaleX.pinLastValue()),
                        tex.height.div(1024).mul(sceneObject.transform.scaleY.pinLastValue()),
                        sceneObject.transform.scaleZ.pinLastValue()
                    );
                    break;

                default:
                    Diagnostics.log(`Invaild scale mode.`);
                    break;
            }
            return scale;
        })
    )
}

/**
 * @param {SceneObjectBase} sceneObject
 * @param {ObjectScaleMode} scaleMode `AutoFit.ObjectScaleMode`
 * @returns {Promise<void>}
 */
export function fitObject(sceneObject, scaleMode) {
    return getFitObjectScale(sceneObject, scaleMode).then(scale => sceneObject.transform.scale = scale);
}

/**
 * @param {SceneObjectBase} sceneObject
 * @param {TextureScaleMode} scaleMode `AutoFit.TextureScaleMode`
 * @returns {Promise<Point2DSignal>} scaledUV
 */
export function getFitTextureUV(sceneObject, scaleMode) {
    return sceneObject.getMaterial().then(mat =>
        mat.getDiffuse().then(tex => {
            const scaleX = sceneObject.transform.scaleX;
            const scaleY = sceneObject.transform.scaleY;

            const textureRatio = tex.width.div(tex.height);

            const scaleWidth = Reactive.div(textureRatio, tex.width);
            const scaleHeight = Reactive.div(1, tex.height);

            const isShort = scaleX.gt(scaleY.mul(textureRatio));

            switch (scaleMode) {
                case TextureScaleMode.FIT:
                    var textureScale = Reactive.max(scaleHeight, scaleWidth);
                    var width = isShort.ifThenElse(
                        tex.width.mul(textureScale).div(textureRatio),
                        tex.width.mul(textureScale).mul(Reactive.div(scaleY, scaleX))
                    );
                    var height = isShort.ifThenElse(
                        tex.height.mul(textureScale).mul(Reactive.div(scaleX, scaleY)).div(textureRatio),
                        tex.height.mul(textureScale)
                    );

                    break;

                case TextureScaleMode.ENVELOPE:
                    var textureScale = Reactive.min(scaleHeight, scaleWidth);
                    var width = isShort.ifThenElse(
                        tex.width.mul(textureScale).mul(Reactive.div(scaleY, scaleX)),
                        tex.width.mul(textureScale).div(textureRatio)
                    );
                    var height = isShort.ifThenElse(
                        tex.height.mul(textureScale),
                        tex.height.mul(textureScale).mul(Reactive.div(scaleX, scaleY)).div(textureRatio)
                    );

                    break;

                case TextureScaleMode.STRETCH:
                    var width = 1;
                    var height = 1;
                    break;

                default:
                    Diagnostics.log(`Invaild scale mode.`);
                    break;
            }

            const scaledUV = scaleUV(uv, Reactive.pack2(width, height));

            return scaledUV;
        })
    )
}

/**
 * @param {SceneObjectBase} sceneObject
 * @param {TextureScaleMode} scaleMode `AutoFit.TextureScaleMode`
 * @param {Point4DSignal} backgroundColor The background color is filled in the empty space in `ENVELOPE` mode. Default is black.
 * @returns {Promise<ShaderSignal>} The scaled texture signal.
 */
export function fitTexture(sceneObject, scaleMode, backgroundColor = Reactive.pack4(0, 0, 0, 1)) {
    return getFitTextureUV(sceneObject, scaleMode).then(uv =>
        sceneObject.getMaterial().then(mat =>
            mat.getDiffuse().then(tex => {
                const color = Shaders.composition(tex.signal, uv);
                const region = Reactive.mul(Reactive.step(uv, 0), Reactive.step(Reactive.sub(1, uv), 0));
                const cropped = Reactive.mix(backgroundColor, color, Reactive.min(region.x, region.y));
                mat.setTextureSlot('DIFFUSE', cropped)
                return cropped;
            })
        )
    )
}