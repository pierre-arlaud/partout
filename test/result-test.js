'use strict';

var chai = require('chai');
var expect = chai.expect;

var partout = require('../lib/app');

describe('result', () => {

    it('should have the basic properties', () => {
        var sample = {
            a: 0
        };

        var result = partout(sample, '*').find();

        expect(result[0]).to.have.property('target');
        expect(result[0]).to.have.property('path');
        expect(result[0]).to.have.property('chain');
    });


});
