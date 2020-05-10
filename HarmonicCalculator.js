'use strict';

class HarmonicCalculator {
    constructor(harmonicType) {
        this.type = harmonicType;

        // 0 < hueDistances < 0.5
        this.analogHueDistance = 0.139 // About 50 degrees
        this.splitComplementaryHueDistance = 0.139
    }

    getPalette(baseColorHsl) {
        switch(this.type) {
            case 0:
                return this.complementary(baseColorHsl);
            case 1:
                return this.monochromatic(baseColorHsl);
            case 2:
                return this.analogous(baseColorHsl);
            case 3:
                return this.splitComplementary(baseColorHsl);
            default:
                return this.complementary(baseColorHsl);
        }
    }

    // Opposite the color wheel
    complementary({h, s, l}) {
        const hComplement = h - 0.5 > 0 ? h - 0.5 : h + 0.5;
        return [
            {h, s, l},
            {h: hComplement, s, l},
        ];
    }

    // Same hue, varying saturation and lightness
    monochromatic({h, s, l}) {
        const sComplement1 = 0.8 * s
        const sComplement2 = 0.6 * s
        const lComplement1 = 0.4 * l

        return [
            {h, s,l},
            {h, s: sComplement1, l: lComplement1},
            {h, s: sComplement2, l},
        ]
    }

    // Nearby hue of distance analogHueDistance away
    analogous({h, s, l}) {
        const d = this.analogHueDistance;
        const hComplement1 = h - d >= 0 ? h - d : h - d + 1;
        const hComplement2 = h + d <  1 ? h + d : h + d - 1;

        return [
            {h, s, l},
            {h: hComplement1, s, l},
            {h: hComplement2, s, l},
        ]
    }

    // Hue analogs of complement
    splitComplementary({h, s, l}) {
        const d = this.splitComplementaryHueDistance;
        const hComplement1 = h - 0.5 - d >= 0 ? h - 0.5 - d : h - d - 0.5 + 1;
        const hComplement2 = h - 0.5 + d >= 0 ? h - 0.5 + d : h + d - 0.5 + 1;

        return [
            {h, s, l},
            {h: hComplement1, s, l},
            {h: hComplement2, s, l},
        ]
    }
}

module.exports = HarmonicCalculator;
