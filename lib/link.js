'use strict';

function factory(target, paths, parent) {
    if (typeof target === 'object') {
        if (Array.isArray(target)) return new ArrayLink(target, paths, parent);
        
        return new ObjectLink(target, paths, parent);
    }
    
    return new NilLink(target, paths, parent);
}

function _typeMatch(target, type) {
    // TODO: date and numeric values
    switch (type) {
    case 'object':
    case 'number':
    case 'string': // TODO? support difference between String(value) and new String(value), ie. object vs string
    case 'boolean':
        return typeof target === type;
    }
    return false;
}

function match(target, property, path) {
    // Basic match checking
    var result = path.path === '*' || property === path.path; // path matching
    result = result && (typeof path.type !== 'string' || _typeMatch(target[property], path.type)) // type matching

    // Checking rules after basic match checking because it is more costly
    if (result && path.rules) {
        result = false;
        var link = factory(target[property], [path.rules]);
        link.iterate(() => result = true);
    }

    return result;
}

function yieldItem(browserLink, property, yielder) {
    browserLink.key = property;

    var firstPath = browserLink.paths[0];
    var item = browserLink.target[property];

    if (match(browserLink.target, property, firstPath)) {
        var shiftedPaths = browserLink.paths.slice(1);
        if (shiftedPaths.length === 0) {
            // Solution found, yielding
            yielder(browserLink, property);
        } else {
            // Continue search on the property with the shifted path
            var subLink = factory(item, shiftedPaths, browserLink)
            subLink.iterate(yielder);
        }
    }
    if (firstPath.connector === 'descendant') {
        // Looking for solutions deeper in the object, no key matched
        var subLink = factory(item, browserLink.paths, browserLink);
        subLink.iterate(yielder);
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
