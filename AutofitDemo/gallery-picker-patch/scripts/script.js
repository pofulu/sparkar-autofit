const Patches = require('Patches');
const Textures = require('Textures');
const Reactive = require('Reactive');

Textures.findFirst('galleryTexture0').then(tex => Patches.inputs.setPoint2D('galleryTextureSize', Reactive.point2d(tex.width, tex.height)));