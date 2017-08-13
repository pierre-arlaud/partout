'use strict';

class Result {

    constructor(target) {
        this._target = target;
    }

    get target() {
        return this._target;
    }

    get path() {
        return null;
    }

    get chain() {
        return null;
    }

}

module.exports = exports = Result;
