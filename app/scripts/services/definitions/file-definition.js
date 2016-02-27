/**
 * @ngdoc object
 * @name jiffy.parser.models:FileDefinition
 * @description 
 * Defines the structure of a file - its type, name, signature records, etc.
 * File definitions are loaded from simple JSON files and then used to parse file contents.
 */

(function(ng, module) {
    'use strict';
    
    ng.module(module).factory('FileDefinition', ['_', 'RecordDefinition', 'FieldDescription',
                                                 function(_, RecordDefinition, FieldDescription) {    
    
        function FileDefinition(parms) {
            parms = parms || {};

            this.comment = parms.comment || '';   
            this.description = parms.description || '';
            this.fieldDelimiter = parms.fieldDelimiter || '';       
            this.fieldWrapper = parms.fieldWrapper || '';                 
            this.format = parms.format || 'fixed';   
            this.lineDelimiter = parms.lineDelimiter || '\r\n';
            this.name = parms.name || 'unknown file definition'; 
            // Later use padCharacter and padLeft
            this.padCharacter = parms.padCharacter || '';
            this.padLeft = parms.padLeft;
            this.recordLength = parms.recordLength || 80;
            this.references = parms.references || [];
            this.signature = parms.signature || '';
            this.suffixes = _.collect(parms.suffixes || [], function(ea) {
                return ea.toLowerCase();
            });
            this.type = parms.type || '??';  
            
            this.displayString = this.type + ' - ' + this.name;
            
            this.recordDefinitions = _.map(parms.records || [], function(rec) {
                return new RecordDefinition(rec);
            });
        }
       
        FileDefinition.prototype.matchesFilename = function(filename) {
            var segments = filename.split('.');
            var suffix = (segments[segments.length - 1] || '').toLowerCase();
            return this.suffixes.indexOf(suffix) > -1;
        };      
        FileDefinition.prototype.matchesSignature = function(data) {
            return this.signature && data.match(this.signature);
        };         
        FileDefinition.prototype.getRecordDefinition = function(data, recordNumber) {
            // Use the record type code or other signature in the data 
            // to find and return the matching recordDefinition
            var recDef = _.find(this.recordDefinitions, function(rec) {
                                    return rec.matchesSignature(data);
                                });
            // If no match on signature, assume a simple Header / Detail or single-definition structure
            if (!recDef) {
                recDef = recordNumber > 1 && this.recordDefinitions[1] ?  
                    this.recordDefinitions[1] : this.recordDefinitions[0];
            }
            return recDef || new RecordDefinition();
        };          
        FileDefinition.prototype.addDescriptions = function(descriptions) {
            var recordDefs = this.recordDefinitions;
            _.each(descriptions, function(description) {
                var fdesc = FieldDescription.parseDescription(description);
                if (fdesc) {
                    var targetRecord = _.find(recordDefs, function(recordDef) {
                       return fdesc.recordTypeCode == recordDef.type;  // jshint ignore:line
                    });
                    if (targetRecord) {
                        targetRecord.addDescription(fdesc);
                    }
                }
            });
        };     
        FileDefinition.prototype.isFixedFormat = function() {
            return this.format === 'fixed';
        };      
        FileDefinition.prototype.isLengthPrefixed = function() {
            return this.format === 'length-prefixed';
        };                                                        

        return FileDefinition;
    }]);          
    
})(angular, 'jiffy.parser'); 