'use strict';

const core = require('../data/core.json');

for (let type in core) {
    for (let domain in core[type]) {
        if (!core[type][domain].urls) {
            console.log(type);
        }

    }
}