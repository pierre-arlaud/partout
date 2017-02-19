var chai = require('chai');
var expect = chai.expect;

var parser = require('../lib/selector-parser');
var parse = parser.parse;

describe('selector-parser', () => {

    it('should parse the empty string as an empty array', () => {
        expect(parse('')).to.have.lengthOf(0);
    });

    it('should parse a single word as a sole indirect starting selector', () => {
        var result = parse('word');
        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.have.property('connector').equal('descendant');
    });

    it('should treat all whitespaces equally', () => {
        var result1 = parse('word word');
        var result2 = parse('word  word');
        var result3 = parse("word \n\tword   \r\nword");
        
        expect(result1).to.have.lengthOf(2);
        expect(result2).to.have.lengthOf(2);
        expect(result3).to.have.lengthOf(3);

        expect(result1[1]).to.have.property('connector').equal('descendant');
        expect(result2[1]).to.have.property('connector').equal('descendant');
        expect(result3[1]).to.have.property('connector').equal('descendant');
        expect(result3[2]).to.have.property('connector').equal('descendant');
    });
    
    it('should give the right connectors for spaces and dots', () => {
        var result = parse('/root person.age');

        expect(result).to.have.lengthOf(3);
        expect(result[0]).to.have.property('connector').equal('child');
        expect(result[1]).to.have.property('connector').equal('descendant');
        expect(result[2]).to.have.property('connector').equal('child');
    });

    it('should parse all typing checks', () => {
        function checkType(path, type) {
            var result = parse(path);
            expect(result[0]).to.have.property('type').equal(type);
        }

        expect(() => parse('var:randomtype')).to.throw();
        checkType('var:string', 'string');
        checkType('person[name]:object', 'object');
    });
    
});
