/**
 * @ngdoc object
 * @name jiffy.parser.models:Record
 * @description 
 * An in-memory representation of a data file record. It includes its fields and any record-level validation problems.
 */

(function(ng, module) {
    'use strict';
    
    ng.module(module).factory('Record', [ '_', 'RecordDefinition', 'Field', function(_, RecordDefinition, Field) {
        
        function Record(recordDefinition, data) {
            this.recordDefinition = recordDefinition || new RecordDefinition();
            this.data = data || '';  
            
            this.displayString = this.recordDefinition.displayString;    
            this.description = this.recordDefinition.description;             

            this.parent = null;
            this.children = [];            
            this.fields = [];
            this.isValid = true;
        }

        Record.prototype.parseFields = function() {   
                // Parse my data (using my FieldDefinitions) and add corresponding Field objects to my fields collection
            var fieldDefs = this.recordDefinition.fieldDefinitions;
            for (var i=0; i < fieldDefs.length; i++) {
                var fieldDef = fieldDefs[i];
                var start = fieldDef.position - 1;
                var fieldData = this.data.substring(start, start + fieldDef.length);
                this.addField(fieldDef, fieldData);
            }
        };    
        Record.prototype.addFields = function(flds) {   
              // Wrap Field objects around the data in 'flds' and add them to my fields collection.
            var fieldDefs = this.recordDefinition.fieldDefinitions;
            for (var i=0; i < flds.length; i++) {
                var fieldData = flds[i] || '';
                var fieldDef = fieldDefs[i];
                this.addField(fieldDef, fieldData);
            }
        };     
        Record.prototype.addField = function(fieldDef, fieldData) {   
            if (fieldDef) {
                var field = new Field(fieldDef, fieldData);
                this.fields.push(field);
            }
        };          
        Record.prototype.createFields = function() {   
            var fieldDefs = this.recordDefinition.fieldDefinitions;
            for (var i in fieldDefs) {
                var fieldDef = fieldDefs[i];
                var fieldData = fieldDef.value || '';
                var field = new Field(fieldDef, fieldData);
                this.fields.push(field);
            }
        };        
        Record.prototype.addChild = function(rec) {
            rec.parent = this;
            this.children.push(rec);
        };    
        Record.prototype.setId = function(id) {
            this.id = id;
            this.elementId = 'record-' + id;
        };         
               
        Record.prototype.getOrderedRecords = function() {
            // Return my records and my children's records in an ordered, flat array
            return _.reduce(this.children, function(array, record) {
                return array.concat(record.getOrderedRecords());
            }, [ this ]);            
        };      
        
        Record.prototype.findRecords = function(testFunction) {
            // Find and return all my records (and my children's records) that 
            // satisfy the given function (returning an non-null value).
            var myResult = testFunction(this);
            return _.reduce(this.children, function(array, record) {
                return array.concat(record.findRecords(testFunction));
            }, myResult ? [ myResult ] : []);        
        };         
        
        Record.prototype.findField = function(regexp) {
            // Return the first field that contains a match for the given regexp
            return _.find(this.fields, function(fld) {
                return regexp.test(fld.data);
            });      
        };         
        
        Record.prototype.validate = function() {
            // Validate this record and its fields and update my isValid state.
            var firstInvalid = _.find(this.fields, function(fld) {
                return fld.validate();
            });
            this.isValid = !firstInvalid;
        };

        return Record;
        
    }]);        
    
})(angular, 'jiffy.parser'); 