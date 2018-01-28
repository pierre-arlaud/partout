'use strict';

var linkBrowser = require('./link-browser');

// TODO: Move factory to a more meaningful place
function factory(target, paths, parent) {
    if (typeof target === 'object') {
        if (Array.isArray(target)) return new ArrayLink(target, paths, parent);
        
        return new ObjectLink(target, paths, parent);
    }
    
    return new NilLink(target, paths, parent);
}

class Link {

    constructor(target, paths, parent) {
        if (! Array.isArray(paths)) throw `Paths must be an array, found ${paths}`;
        if (paths.length === 0) throw `Links must have a non-empty path`;

        this.target = target;
        this.paths = paths;
        this.parent = parent;
    }

    iterate(yielder, browser) {
    }

    /** The original selector of the query, so that it can be shown in the results */
    get selector() {
        if (this.parent) return this.parent.selector;
        else return this._selector;
    }
    
    set selector(value) {
        this._selector = value;
    }

    get key() {
        return this._key;
    }

    set key(value) {
        this._key = value;
    }

    /** Recursive building of the chain of keys */
    get chain() {
        if (!this.parent) return [this.key];
        var chain = this.parent.chain;
        chain.push(this.key);
        return chain;
    }

}

class NilLink extends Link {
}


class ObjectLink extends Link {

    constructor(target, paths, parent) {
        super(target, paths, parent);
    }

    iterate(yielder, browser) {
        if (!browser) browser = new linkBrowser.LinkBrowser(factory);
        for (var property in this.target) {
            if (this.target.hasOwnProperty(property)) {
                browser.browseItem(this, property, yielder);
            }
        }
    }
    
}

class ArrayLink extends Link {
    
    constructor(target, paths, parent) {
        super(target, paths, parent);
    }

    iterate(yielder, browser) {
        if (!browser) browser = new linkBrowser.LinkBrowser(factory);
        for (var i = 0, n = this.target.length; i < n; i++) {
            browser.browseItem(this, i, yielder);
        }
    }

}

exports = module.exports = {
    factory: factory,
    ObjectLink: ObjectLink,
    ArrayLink: ArrayLink,
    NilLink: NilLink
}
