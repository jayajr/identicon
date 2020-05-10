'use strict';

const Jimp = require('jimp');

const Conversions = require('./Conversions');

const UNIT_SIZE = 4;

class ImageBuilder {
    constructor(symmetryType, palette) {
        this.scale = UNIT_SIZE;
        this.type = symmetryType;
        this.palette = palette.map( hslColor => Conversions.hslToInt(hslColor) );
    }

    getJimpImage(imageHash) {
        let imageMap;
        switch(this.type) {
            case 0:
                imageMap = this.bilateral(imageHash);
                break;
            case 1:
                imageMap = this.radial4(imageHash);
                break;
            default:
                imageMap = this.bilateral(imageHash);
                break;
        }

        return this.resample(imageMap);
    }

    resample(imageMap, scale=32) {
        if (scale <= 1) {
            return imageMap;
        }

        const jimage = new Jimp(this.scale * 2 * scale, this.scale * 2 * scale);

        // Shift scale * scale window
        for (let i_scale = 0; i_scale < this.scale * 2; i_scale++) {
            for (let j_scale = 0; j_scale < this.scale * 2; j_scale++) {
                let color = imageMap.getPixelColor(i_scale, j_scale);
                let i_left = i_scale * scale,
                    i_right = (i_scale + 1) * scale,
                    j_left = j_scale * scale,
                    j_right = (scale + 1) * scale;

                for (let i = i_left; i < i_right; i++) {
                    for (let j = j_left; j < j_right; j++) {
                        // Intentional rotation
                        jimage.setPixelColor(color, j, i);
                    }
                }
            }
        }

        return jimage;
    }

    // Symmetry along top-down axis
    bilateral(imageHash) {
        const jimage = new Jimp(this.scale * 2, this.scale * 2);

        for (let i = 0; i < this.scale * 2; i++) {
            for (let j = 0; j < this.scale; j++) {
                const colorIdx = parseInt(imageHash[i * this.scale * 2 + j], 16)
                    % this.palette.length;
                const color = this.palette[colorIdx];

                jimage.setPixelColor(color, i, j);
                jimage.setPixelColor(color, i, this.scale * 2 - j - 1);
            }
        };
        return jimage;
    }

    // Symmetry along top-down and left-right axes
    radial4(imageHash) {
        const jimage = new Jimp(this.scale * 2, this.scale * 2);

        for (let i = 0; i < this.scale; i++) {
            for (let j = 0; j < this.scale; j++) {
                const colorIdx = parseInt(imageHash[i * this.scale * 2 + j], 16)
                    % this.palette.length;
                const color = this.palette[colorIdx];

                jimage.setPixelColor(color, i, j);
                jimage.setPixelColor(color, i, this.scale * 2 - j - 1);
                jimage.setPixelColor(color, this.scale * 2 - i - 1, j);
                jimage.setPixelColor(color, this.scale * 2 - i - 1, this.scale * 2 - j - 1);
            }
        }
        return jimage;
    }
}

module.exports = ImageBuilder;
