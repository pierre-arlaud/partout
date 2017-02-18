var chai = require('chai');
var expect = chai.expect;

var parser = require('../lib/selector-parser');
var parse = parser.parse;

describe('selector-parser', function() {

    it('should parse the empty string as an empty array', function() {
        expect(parse('')).to.have.lengthOf(0);
    });

    it('should parse a single word as a sole starting selector', function() {
        var result = parse('word');
        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.have.property('connector').equal('start');
    });

    it('should treat all whitespaces equally', function() {
        var result1 = parse('word word');
        var result2 = parse('word  word');
        var result3 = parse("word \n\tword   \r\nword");
        
        expect(result1).to.have.lengthOf(2);
        expect(result2).to.have.lengthOf(2);
        expect(result3).to.have.lengthOf(3);

        expect(result1[1]).to.have.property('connector').equal('ws');
        expect(result2[1]).to.have.property('connector').equal('ws');
        expect(result3[1]).to.have.property('connector').equal('ws');
        expect(result3[2]).to.have.property('connector').equal('ws');
    });
    
    it('should give the right connectors for spaces and dots', function() {
        var result = parse('root person.age');

        expect(result).to.have.lengthOf(3);
        expect(result[0]).to.have.property('connector').equal('start');
        expect(result[1]).to.have.property('connector').equal('ws');
        expect(result[2]).to.have.property('connector').equal('dot');
    });
    
});
