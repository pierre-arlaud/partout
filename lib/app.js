'use strict';

var parser = require('./selector-parser');
var link = require('./link');

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

    count() {
        var count = 0;
        this._selectors.forEach(selector => {
            var paths = parser.parse(selector);
            var startLink = new link.ObjectLink(this._target, paths);
            startLink.iterate(() => count++);
        });
        return count;
    }

    set(value) {
        this._selectors.forEach(selector => {
            var paths = parser.parse(selector);
            var startLink = new link.ObjectLink(this._target, paths);
            startLink.iterate((target, prop) => {
                target[prop] = value;
            });
        });
        return this._target;
    }



}

module.exports = exports = (target, selector) => new Partout(target, selector);
