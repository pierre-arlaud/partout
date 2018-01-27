'use strict';

var chai = require('chai');
var expect = chai.expect;

var partout = require('../lib/app');

describe('app', () => {
    
    it('should support case with no selector given', () => {
        expect(partout({}).find()).to.have.lengthOf(0);
        expect(partout({}, '').find()).to.have.lengthOf(0);
        expect(partout({'': 'empty-key'}, '').find()).to.have.lengthOf(1);
    });
    
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
        };
        
        expect(partout(sample, ['a']).set(-1).a).to.equal(-1);
    });
   
    it('should check matches', () => {
        var sample = {
            a: 2
        };
        
        expect(partout(sample).matches('a')).to.be.true;
        expect(partout(sample).matches('b')).to.be.false;
    });
    
    it('should allow flexible selectors passing', () => {
        var sample = {
            person: {
                address: 'here',
            }
        };
        
        expect(partout(sample, 'person').find('address')).to.have.lengthOf(1);
        expect(partout(sample, ['person']).find('address')).to.have.lengthOf(1);
        expect(partout(sample, 'person').find(['address'])).to.have.lengthOf(1);
        expect(partout(sample, ['person']).find(['address'])).to.have.lengthOf(1);
    });
    
    it('should have flexible selectors support for most methods', () => {
        var sample = {
            person: {
                address: 'here',
                name: 'Mr'
            }
        };
        
        expect(partout(sample).find('address')).to.have.lengthOf(1);
        expect(partout(sample, ['person']).count(['address', 'name'])).to.equal(2);
        expect(partout(sample, 'person').set(['name'], 'Mrs').person.name).to.equal('Mrs');
        expect(partout(sample, 'person').match('name')).to.be.true;
    });
    
});

