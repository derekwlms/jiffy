/**
 * @ngdoc object
 * @name jiffy.parser.models:FieldDefinition
 * @description 
 * Defines a field within a file - its name, type, length, etc.
 * Field definitions are loaded from simple JSON files and then used to parse file contents.
 */

(function(ng, module, _) {
    'use strict';
    
    var typeToRegexMap = {
        'A':            [ '[A-Z ]+', 'Alpha (uppercase)' ],       
        'AN':           [ '[A-Z0-9 ]+', 'Alphanumeric (uppercase, 0-9)' ],
        'ANC':          [ '[A-Za-z0-9 ]+', 'Alphanumeric (mixed case, 0-9)' ],        
        'bTTTTAAAAC':   [ '([ ]{1})([0-9]{9})', 'Routing/Transit (bTTTTAAAAC)' ],          
        'CYYMMDD':      [ '[0|1][0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])' ],        
        'HHMM':         [ '([0-9]|0[0-9]|1[0-9]|2[0-3])[0-5][0-9]' ],    
        'HHMMSS':       [ '([0-9]|0[0-9]|1[0-9]|2[0-3])[0-5][0-9][0-5][0-9]' ],         
        'N':            [ '[0-9]+', 'Numeric (digits)' ],          
        'YYMMDD':       [ '[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])' ],
        'YYYYMMDD':     [ '[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])' ]        
    };
    
    var validationMessages = {
        'EMPTY_REQUIRED_FIELD': 'Required field is empty',
        'FIELD_TOO_LONG': 'Field data exceeds maximum length',
        'PATTERN_MISMATCH': 'Field does not match the required type or pattern'
    };
    
    function FieldDefinition(parms, index, position) {
        parms = parms || {};
        
        this.name = parms[0] || '-';
        this.length = parms[1] || 50;
        this.requirement = parms[2] || 'O';
        this.type = parms[3] || ''; 
        this.value = parms[4] || '';
        this.description = parms[5] || '';
        if (parms[6]) {
            // Later add other options as needed, like skip and padright
            this.isReadOnly = parms[6].indexOf('readonly') > -1;
        }
        if (parms[7] && parms[7][0]) {
            this.codes = _.map(parms[7], function(codeString) {
                var values = codeString.split('=');
                return { code: values[0].trim(), description: values[1] ? values[0] + ' - ' + values[1] : values[0] };
            });
        }
        
        this.index = index;
        this.position = position;
        
        this.id = this.name.replace(/\s+/g, '');
        this.isRequired = this.requirement === 'R' || this.requirement === 'M';
        
        this.formatName = this.type;
        var patternSpec = typeToRegexMap[this.type];
        if (patternSpec) {
            this.pattern = patternSpec[0];
            this.regexp = new RegExp('^' + this.pattern + '$');
            this.formatName = patternSpec[1] || this.type;
            this.formatMessage = 'in ' + this.formatName + ' format';
        } else {
            if (this.type) {
                this.pattern = this.type;
                this.regexp = new RegExp('^' + this.pattern + '$');                
                this.formatMessage = 'equal to ' + this.type;
            }        
        }
    }
    
    FieldDefinition.prototype.isMandatory = function() {
        return this.requirement === 'M';
    };    
    FieldDefinition.prototype.isOptional = function() {
        return this.requirement === 'O';
    };       
    FieldDefinition.prototype.validate = function(data) {
            // Validate the given data against this field definition
            // and return an error message for the first problem found.
        if (data) {
            if (data.length > this.length) {
                return validationMessages.FIELD_TOO_LONG;
            }
            if (this.regexp && !this.regexp.test(data)) {
                return validationMessages.PATTERN_MISMATCH;
            }
        } else {
            if (!this.isOptional()) {
                return validationMessages.EMPTY_REQUIRED_FIELD;
            }
        }
        return null;
    };       
    
    ng.module(module).factory('FieldDefinition', function() {
        return FieldDefinition; });    
    
})(angular, 'jiffy.parser', _); 