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

    /** Browse with the selectors of this object and iterate results on links
     * with the yielder parameter as the callback
     */
    _browse(yielder) {
        this._selectors.forEach(selector => {
            if (typeof selector !== 'string' || selector === null) return;
            if (selector.length === 0) {
                // very funny case of the empty string as an object key
                if ('' in this._target) yielder(new link.ObjectLink(this._target, ['']), selector);
                return;
            }

            var paths = parser.parse(selector);
            var startLink = new link.ObjectLink(this._target, paths);
            startLink.selector = selector;
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
        this.find().forEach(result => {
            selectors.forEach(selector => {
                var endResult = method(new Partout(result.target, selector));
                if (endResult) results.push(endResult);
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
        this._browse((link, prop) => {
            link.target[prop] = value;
        });
        return this._target;
    }

    find(selectors) {
        // Flexible selectors
        if (selectors) {
            if (this._selectors.length > 0) {
                var results = this._flexSelector(selectors, sub => sub.find());
                // Flatten bidimensional array as one array
                return [].concat.apply([], results);
            } else this.select(selectors);
        }
        
        // Normal case
        var results = [];
        this._browse((link, prop) => {
            var result = new Result(link, link.target[prop]);
            results.push(result);
        });
        return results;
    }


}

module.exports = exports = (target, selector) => new Partout(target, selector);
