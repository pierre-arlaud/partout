'use strict';

class LinkBrowser {

    /** Create a link browser to iterate using a path object
     * @param linkFactory a factory function to build next links using a target, a property and a parent link
     */
    constructor(factory) {
        this._factory = factory;
        this._searching = true;
    }


    /** Recursive browsing of a link item
     * @param browserLink the link, the target of which will be browsed
     * @param property the property to browse in the target
     * @param yielder a function to call for every solution found
     */
    browseItem(browserLink, property, yielder) {
        if (!this._searching) return;
        browserLink.key = property;

        var firstPath = browserLink.paths[0];
        var item = browserLink.target[property];

        if (this.match(browserLink.target, property, firstPath)) {
            var shiftedPaths = browserLink.paths.slice(1);
            if (shiftedPaths.length === 0) {
                // Solution found, yielding
                yielder(browserLink, property, this);
            } else {
                // Continue search on the property with the shifted path
                var subLink = this._factory(item, shiftedPaths, browserLink);
                subLink.iterate(yielder, this);
            }
        }
        if (firstPath.connector === 'descendant') {
            // Looking for solutions deeper in the object, no key matched
            var subLink = this._factory(item, browserLink.paths, browserLink);
            subLink.iterate(yielder, this);
        }
    }

    _typeMatch(target, type) {
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

    match(target, property, path) {
        // Basic match checking
        var result = path.path === '*' || property === path.path; // path matching
        result = result && (typeof path.type !== 'string' || this._typeMatch(target[property], path.type)) // type matching

        // Checking rules after basic match checking because it is more costly
        if (result && path.rules) {
            result = false;
            var link = this._factory(target[property], [path.rules]);
            link.iterate(() => {
                result = true;
            });
        }

        return result;
    }
    
    stop() {
        this._searching = false;
    }
    
}

exports = module.exports = {
    LinkBrowser: LinkBrowser
}
