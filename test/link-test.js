'use strict';

var chai = require('chai');
var expect = chai.expect;

var link = require('../lib/link');

describe('link', () => {

    function count(sample, paths, expectedCount) {
        var count = 0;
        var yielder = () => count++;
        new link.ObjectLink(sample, paths).iterate(yielder);
        expect(count).to.equal(expectedCount);
    }

    it('should find children elements', () => {
        var sample = {
            a: true,
            b: false, // only matching element
            c: { a: 0, b: 0, c: 0 }
        };
        var paths = [{
            connector: 'child',
            path: 'b'
        }];
        count(sample, paths, 1);
    });

    it('should always match wild card', () => {
        var sample = {
            a: {
                b: {
                    c: 1 // 1
                },
            },
            b: {
                b: { // 2
                    a: 0 // 3
                },
                c: 3, // 4
                d: { // 5
                    b: false
                } 
            }
        };
        var paths = [{
            connector: 'descendant',
            path: 'b'
        }, {
            connector: 'child',
            path: '*'
        }];
        count(sample, paths, 5);
    });
    
    
    it('should support "descendant" and "child" connectors combinations', () => {
        var sample = {
            a: {
                b: {
                    c: 1 // 1
                },
                c: 0 // 2
            },
            c: {}
        };

        var paths = [{
            connector: 'descendant',
            path: '*'
        }, {
            connector: 'child',
            path: 'c'
        }];
        
        count(sample, paths, 2);
    });
    
    
    it('should iterate on object properties to find descendants', () => {
        var sample = {
            a: 2,
            b: { a: 0}
        };
        var paths = [{
            connector: 'descendant',
            path: 'a'
        }];
        count(sample, paths, 2);
    });

    it('should search for nested paths also on matching objects', () => {
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
            connector: 'descendant',
            path: 'a'
        }];
        count(sample, paths, 4);
    });

    it('should search for paths recursively', () => {
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
                connector: 'descendant',
                path: 'a'
            },
            {
                connector: 'descendant',
                path: 'b'
            }
        ];
        /* Results:
           - (a).a.(b)
           - a.(a).(b)
           - (a).c.(b)
           */
        count(sample, paths, 3);
    });
    
});

