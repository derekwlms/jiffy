/**
 * @ngdoc service
 * @name jiffy.parser.factories:FileFormatter
 * @description 
 * Formats file contents (based on RecordDefinitions and FieldDefinitions) into a single data stream.
 * Supports various file formats including fixed, CSV, and length-prefixed.
 * See FileParser for the reverse process.
 */

(function(ng, module) {
    'use strict';
    
    ng.module(module).factory('FileFormatter', ['_', '$log', 'File', 'FileDefinition',  
                                             function(_, $log) {
        
        function FileFormatter() {
        }        
        
        function formatFixed(records, lineDelimiter) {
                // Format the given records returning a fixed-format string.
                // Add the optional lineDelimiter.
             
            return _.reduce(records, function(str, record) {
                return _.reduce(record.fields, function(recStr, field) {
                    return recStr + field.formatData();
                }, str) + lineDelimiter;
            }, '');
        }
                                                 
        function formatDelimited(records, lineDelimiter, fieldDelimiter, fieldWrapper) {
                // Format the given records returning a delimited (CSV, etc.) string.
                // Add the optional lineDelimiter, fieldDelimiters, and fieldWrappers.            
            return _.reduce(records, function(str, record) {
                var line = _.reduce(record.fields, function(recStr, field) {
                    return recStr + field.formatData(fieldWrapper) + fieldDelimiter;
                }, str);
                return line.substring(0, line.length - 1) + lineDelimiter;
            }, '');
        }
        
        FileFormatter.prototype.formatText = function(file) {
                // Format the given file based on its format type and record and field definitions.
                // Return a string containing the formatted data.
            
            $log.debug('FileFormatter - formatText', file);
            
            var records = file.getOrderedRecords();
            var fileDef = file.fileDefinition;
            
            if (file.fileDefinition.isFixedFormat()) {
                return formatFixed(records, fileDef.lineDelimiter);
            } else if (fileDef.isLengthPrefixed()) {
                // TODO do length-prefixed (X9)
            } else {
                // Assume delimited (CSV, etc.)
                return formatDelimited(records, fileDef.lineDelimiter, 
                                        fileDef.fieldDelimiter || ',', fileDef.fieldWrapper || '"');
            }
        };
        
        return FileFormatter;
        
    }]);
    
})(angular, 'jiffy.parser'); 