'use strict';

const crypto = require('crypto');
const Jimp = require('jimp');

const Conversions = require('./Conversions');
const HarmonicCalculator = require('./HarmonicCalculator');
const ImageBuilder = require('./ImageBuilder');

class Identicon {
    constructor(input) {
        this.input = input;
        const hash = this.hashInput(input);
        const segments = this.segmentHash(hash);
        this.identicon = this.buildIdenticon(segments);
        return this.identicon.write(this.input + '.png')
    }

    /* Hashes input using sha512
     *  Using that primarily because of constant width
     *  Speed is pretty good on 64 bit machines too
     */
    hashInput(input) {
        const sha = crypto.createHash('sha512');
        sha.update(input);
        return sha.digest('hex');
    }

    /* Base Color is first 8 hex digits as hex color code
     *
     * Color Harmony Types:
     *  0: Complementary
     *  1: Monochromatic
     *  2: Analogous
     *  3: Split Complementary
     *
     * Symmetry Types:
     *  0: Bilateral symmetry
     *  1: Radial symmetry (4)
     *
     * Image Map
     *  106 wide array of hex digits
     */
    segmentHash(hash) {
        const baseColorHex = hash.slice(0,6);
        const harmonyType = parseInt(hash.slice(6,14), 16) % 4;
        const symmetryType = parseInt(hash.slice(14,22), 16) % 2;
        const imageMap = hash.slice(22);

        return { baseColorHex, harmonyType, symmetryType, imageMap };
    }

    buildIdenticon({ baseColorHex, harmonyType, symmetryType, imageMap }) {
        const baseColorRgb = Conversions.hexToRgb(baseColorHex);
        const baseColorHsl = Conversions.rgbToHsl(baseColorRgb);
        
        const harmonicCalculator = new HarmonicCalculator(harmonyType);
        const palette = harmonicCalculator.getPalette(baseColorHsl);

        const imageBuilder = new ImageBuilder(symmetryType, palette);
        return imageBuilder.getJimpImage(imageMap);
    }

}

module.exports = Identicon;
