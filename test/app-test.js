'use strict';

var chai = require('chai');
var expect = chai.expect;

var partout = require('../lib/app');

describe('app', () => {

    it('should count elements', () => {
        var sample = {
            a: 0,
            b: { a: 1 }
        };
        expect(partout(sample, 'a').count()).to.equal(2);
        expect(partout(sample, ['a', 'b a', 'b']).count()).to.equal(4);
    });

    it('should set elements', () => {
        var sample = {
            a: 'hello',
            b: 3
        }
        expect(partout(sample, ['a']).set(-1).a).to.equal(-1);
    });
    

});

