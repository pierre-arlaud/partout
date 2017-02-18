'use strict';

function factory(target, paths) {

    if (typeof target === 'object') {
        if (Array.isArray(target)) return new ArrayLink(target, paths);
        
        return new ObjectLink(target, paths);
    }
    
    return new NilLink(target, paths);
}

function match(target, prop, path) {
    return prop === path.path;
}

function yieldItem(browser, property, yielder) {
    var firstPath = browser.paths[0];
    var item = browser.target[property];
    
    if (match(browser.target, property, firstPath)) {
        var nextPaths = browser.paths.slice(1);
        if (nextPaths.length === 0) {
            yielder(property);
        } else {
            factory(item, browser.paths.slice(1)).iterate(yielder);
        }
        
    }
    factory(item, browser.paths).iterate(yielder);
}


class Link {

    constructor(target, paths, callback) {
        if (! Array.isArray(paths)) throw `Paths must be an array, found ${paths}`;
        if (paths.length === 0) throw `Links must have a non-empty path`;

        this.target = target;
        this.paths = paths;
    }

    iterate(yielder) {

    }

}

class NilLink extends Link {

    
}


class ObjectLink extends Link {

    constructor(target, paths) {
        super(target, paths);
    }

    iterate(yielder) {
        for (var property in this.target) {
            if (this.target.hasOwnProperty(property)) {
                yieldItem(this, property, yielder);
            }
        }
    }
    

}

class ArrayLink extends Link {
    constructor(target, paths) {
        super(target, paths);
    }

    iterate(yielder) {
        for (var i = 0, n = this.target.length; i < n; i++) {
            yieldItem(this, i, yielder);
        }
    }

}


exports = module.exports = {
    ObjectLink: ObjectLink,
    ArrayLink: ArrayLink,
    NilLink: NilLink
}
