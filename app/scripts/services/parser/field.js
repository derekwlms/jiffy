/**
 * @ngdoc object
 * @name jiffy.parser.models:Field
 * @description 
 * An in-memory representation of a data file field. It includes its definition and any field-level validation problems.
 */

(function(ng, module) {
    'use strict';
    
    ng.module(module).factory('Field', ['FieldDefinition', function(FieldDefinition) {

        function Field(fieldDefinition, data) {
            this.fieldDefinition = fieldDefinition || new FieldDefinition();
            this.data = data || '';           
            
            this.name = this.fieldDefinition.name;    
            this.description = this.fieldDefinition.description;                 
        }

        Field.prototype.formatData = function(fieldWrapper) {  
            // Maybe later add padding and justification if the field isn't already padded.  
            return fieldWrapper ?
                fieldWrapper + this.data + fieldWrapper : this.data;
        };  
        
        Field.prototype.validate = function() {
            // Validate this field and return an error message for the first problem found.            
            return this.fieldDefinition.validate(this.data);
        };      

        return Field;
        
    }]);        
    
})(angular, 'jiffy.parser'); 