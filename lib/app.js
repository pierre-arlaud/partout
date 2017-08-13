'use strict';

var parser = require('./selector-parser');
var link = require('./link');
var Result = require('./result');

class Partout {

    constructor(target, selector) {
        this._selectors = [];
        this._target = target;
        
        if (typeof selector !== 'undefined' && selector !== null) {
            this.select(selector);
        }
    }
    
    select(selector) {
        if (typeof selector === 'string') selector = [selector];
        if (Array.isArray(selector)) this._selectors = selector;
        return this;
    }

    and(selector) {
        if (typeof selector === 'string') {
            this._selectors.push(selector);
        } else if (Array.isArray(selector)) {
            this._selectors = this.selector.concat(selector);
        }
        return this;
    }

    _browse(yielder) {
        this._selectors.forEach(selector => {
            if (typeof selector !== 'string' || selector === null) return;
            if (selector.length === 0) {
                // very funny case of the empty string as an object key
                if ('' in this._target) yielder(this._target, selector);
                return;
            }

            var paths = parser.parse(selector);
            var startLink = new link.ObjectLink(this._target, paths);
            startLink.iterate(yielder);
        });
    }

    /** Called when selectors were given both in the partout constructor 
     * and the first argument of a method of the api.
     * This will apply method recursively with the given selector.
     */
    _flexSelector(selector, method) {
        var selectors = Array.isArray(selector) ? selector : [selector];
        var results = [];
        this.find().forEach(elem => {
            selectors.forEach(selector => {
                var result = method(new Partout(elem.target, selector));
                if (result) results.push(result);
            });
        });
        return results;
    }

    count(selector) {
        // Flexible selectors
        if (selector) {
            if (this._selectors.length > 0) {
                var count = 0;
                this._flexSelector(selector, sub => count += sub.count());
                return count;
            } else this.select(selector);
        }

        // Normal case
        var count = 0;
        this._browse(() => count++);
        return count;
    }

    set(mixed, value) {
        // Flexible selectors
        if (arguments.length > 1) {
            if (this._selectors.length > 0) {
                this._flexSelector(mixed, sub => sub.set(value));
                return this._target;
            } else this.select(selector);
        } else value = mixed;

        // Normal case
        this._browse((target, prop) => {
            target[prop] = value;
        });
        return this._target;
    }

    find(selector) {
        // Flexible selectors
        if (selector) {
            if (this._selectors.length > 0) {
                var results = this._flexSelector(selector, sub => sub.find());
                // Flatten bidimensional array as one array
                return [].concat.apply([], results);
            } else this.select(selector);
        }
        
        // Normal case
        var results = [];
        this._browse((target, prop) => {
            results.push(new Result(target[prop]));
        });
        return results;
    }


}

module.exports = exports = (target, selector) => new Partout(target, selector);
