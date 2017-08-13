'use strict';

class Result {

    constructor(link, target) {
        this._link = link;
        this._target = target;
    }

    get link() {
        return this._link;
    }
    
    get target() {
        return this._target;
    }

    get path() {
        return this.link.selector;
    }

    get chain() {
        return this.link.chain;
    }

}

module.exports = exports = Result;
