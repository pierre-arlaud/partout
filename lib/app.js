'use strict';

var parser = require('./selector-parser');
var link = require('./link');

class Partout {

    constructor(target, selector) {
        this._selectors = [];
        
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
        this._selectors.forEach(selector => {
            var paths = parser.parse(selector);
            var startLink = new link.ObjectLink(target, paths);
            startLink.iterate();
        });
        return 0;
    }



}

module.exports = exports = (target, selector) => new Partout(target, selector);
