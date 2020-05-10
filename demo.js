'use strict';

const Identicon = require('./Identicon');

const screenNames = process.argv.slice(2);

screenNames.forEach(name => new Identicon(name));
