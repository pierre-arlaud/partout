'use strict';

var chai = require('chai');
var expect = chai.expect;

var link = require('../lib/link');

describe('link', function() {

    function count(sample, paths, expectedCount) {
        var count = 0;
        var yielder = () => count++;
        new link.ObjectLink(sample, paths).iterate(yielder);
        expect(count).to.equal(expectedCount);
    }
    
    it('should iterate on object properties', function() {
        var sample = {
            a: 2,
            b: { a: 0}
        };
        var paths = [{
            connector: 'start',
            path: 'a'
        }];
        count(sample, paths, 2);
    });

    it('should search for nested paths also on matching objects', function() {
        var sample = {
            a: { // 1
                a: 2, // 2
                b: {
                    c: 1,
                    d: [],
                    e: {
                        a: [] // 3
                    }
                }
            },
            b: {
                b: 0,
                a: null // 4
            }
        };
        var paths = [{
            connector: 'start',
            path: 'a'
        }];
        count(sample, paths, 4);
    });

    it('should search for paths recursively', function() {
        var sample = {
            a: {
                a: { b: 0 },
                c: {
                    b: 3,
                    a: 1
                }
            }
        };
        var paths = [
            {
                connector: 'start',
                path: 'a'
            },
            {
                connector: 'ws',
                path: 'b'
            }
        ];
        count(sample, paths, 3);
    });
    
});

