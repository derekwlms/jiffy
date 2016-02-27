/**
 * @ngdoc object
 * @name jiffy.parser.models:RecordDefinition
 * @description 
 * Defines a record within a file - its name, record type code, fields, etc.
 * Record definitions are loaded from simple JSON files and then used to parse file contents.
 */

(function(ng, module) {
    'use strict';
    
    ng.module(module).factory('RecordDefinition', ['_', 'FieldDefinition', 'FieldDescription',
                                                   function(_, FieldDefinition) {    
        
        var UNKNOWN_RECORD_TYPE = '-';

        function RecordDefinition(parms) {
            parms = parms || {};

            this.description = parms.description || parms.name || '';   
            this.name = parms.name || 'unknown record definition';        
            this.type = parms.type || UNKNOWN_RECORD_TYPE;  
            this.signature = parms.signature;
            this.parent = parms.parent;
            
            this.displayString = this.type + ' - ' + this.name;            
            
            var position = 1;
            this.fieldDefinitions = _.map(parms.fields || [], function(fld, index) {
                var fd = new FieldDefinition(fld, index + 1, position);
                position += fd.length;
                return fd;
            });    
        }

        RecordDefinition.prototype.matchesSignature = function(data) {
            // Return true if this record definition matches the signature in the given data
            return this.signature ?
                data.match(this.signature) : data[0] === this.type[0];
        };            
        RecordDefinition.prototype.getFieldDefinition = function(index) {
            return this.fieldDefinitions[index] || new FieldDefinition();
        };    
        RecordDefinition.prototype.addDescription = function(fieldDescription) {
            // Add the description text in fieldDescription to the matching RecordDefinition or FieldDefinition
            if (fieldDescription.isRecordDescription()) {
                this.description = fieldDescription.text || this.description;
            } else {
                var targetField = _.find(this.fieldDefinitions, function(fieldDef) {
                   return fieldDescription.fieldIndex == fieldDef.index;  // jshint ignore:line
                });
                if (targetField) {
                    targetField.description = fieldDescription.text || targetField.description;
                }
            }
        };      

        return RecordDefinition;
    }]);         
    
})(angular, 'jiffy.parser'); 