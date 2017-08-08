'use strict';

function factory(target, paths) {

    if (typeof target === 'object') {
        if (Array.isArray(target)) return new ArrayLink(target, paths);
        
        return new ObjectLink(target, paths);
    }
    
    return new NilLink(target, paths);
}

function match(target, prop, path) {
    return path.path === '*' || prop === path.path;
}

function yieldItem(browser, property, yielder) {
    var firstPath = browser.paths[0];
    var item = browser.target[property];
    
    if (match(browser.target, property, firstPath)) {
        var shiftedPaths = browser.paths.slice(1);
        if (shiftedPaths.length === 0) {
            // Solution found, yielding
            yielder(browser.target, property);
        } else {
            // Continue search on the property with the shifted path
            factory(item, shiftedPaths).iterate(yielder);
        }
        
    }
    if (firstPath.connector === 'descendant') {
        // Looking for solutions deeper in the object
        factory(item, browser.paths).iterate(yielder);
    }
}


class Link {

    constructor(target, paths, parent) {
        if (! Array.isArray(paths)) throw `Paths must be an array, found ${paths}`;
        if (paths.length === 0) throw `Links must have a non-empty path`;

        this.target = target;
        this.paths = paths;
        this.parent = parent;
    }

    iterate(yielder) {

    }

}

class NilLink extends Link {
    
}


class ObjectLink extends Link {

    constructor(target, paths, parent) {
        super(target, paths, parent);
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
    constructor(target, paths, parent) {
        super(target, paths, parent);
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
