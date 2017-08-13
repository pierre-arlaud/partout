'use strict';

var chai = require('chai');
var expect = chai.expect;

var partout = require('../lib/app');

describe('results', () => {

    it('should have the basic properties', () => {
        var sample = {
            a: 0
        };

        var results = partout(sample, '*').find();

        expect(results).to.have.lengthOf(1);
        expect(results[0]).to.have.property('target');
        expect(results[0]).to.have.property('path');
        expect(results[0].path).not.to.be.null;
        expect(results[0]).to.have.property('chain');
        expect(results[0].chain).not.to.be.null;
    });

    it('should have the chain of results', () => {
        var sample = {
            first: {
                second: {
                    third: {
                        fourth: {}
                    }
                }
            }
        };

        var results = partout(sample).find('first third');

        expect(results).to.have.lengthOf(1);
        expect(results[0].path).to.equal('first third');

        expect(results[0].chain).to.have.lengthOf(3);
        expect(results[0].chain[0]).to.equal('first');
        expect(results[0].chain[1]).to.equal('second');
        expect(results[0].chain[2]).to.equal('third');
    });

});
