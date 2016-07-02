/**
 * @ngdoc service
 * @name jiffy.parser.factories:FileParser
 * @description 
 * Parses files (based on RecordDefinitions and FieldDefinitions) into File and Record objects.
 * Supports various file formats including fixed, CSV, and length-prefixed.
 * Calls the onError callback if an unresolvable parsing error occurs.
 * See FileFormatter for the reverse process.
 */

(function(ng, module) {
    'use strict';
    
    ng.module(module).factory('FileParser', ['$log', 'File', 'FileDefinition', 'DefinitionsService', 'CsvParser',
                                             function($log, File, FileDefinition, definitionsService,  CsvParser) {
        
        function FileParser() {
            this.onError = null;
        }        
        
        function parseFixed(file, data) {
                // Parse the fixed-format record in 'data' and create records in the 'file' object.
                // Handle optional line delimiters (\r\n or \n).
            var i = 0, recordNumber = 0;
            var recordLength = file.fileDefinition.recordLength;
            while (i < data.length) {
                // Later handle variable-length records (with length prefix and/or just \n)
                // Later check fileDefinition.lineDelimiter and maybe use split(/\r?\n/) instead
                var recordEnd = i + recordLength;                
                var lineEnd = data.indexOf('\r', i);
                if (lineEnd === -1) {
                    lineEnd = data.indexOf('\n', i);
                    if (lineEnd === -1) {
                        lineEnd = recordEnd;
                    }
                } else if (data[lineEnd + 1] === '\n') {
                    lineEnd++;
                }
                if (recordEnd > lineEnd) {
                    recordEnd = lineEnd;
                }
                var recordData = data.substring(i, recordEnd);
                $log.debug('Read record', recordData, i, recordEnd, lineEnd);                
                file.addRecord(recordData, null, ++recordNumber);
                i = lineEnd + 1;
            }            
        }
                                                 
        function parseDelimited(file, data, fieldDelimiter) {
                // Parse the field-delimited record in 'data' and create records in the 'file' object.
            var records = new CsvParser().csvToArray(data, fieldDelimiter);    
            for (var i=0; i < records.length; i++) {
                file.addRecord(null, records[i], i+1);
            }
        }
        
        FileParser.prototype.parseText = function(filename, data) {
                // Find the FileDefinition for the given file.
                // Then parse the data based on its format and record and field definitions.
            
            $log.debug('FileParser - parseFile', filename, data);
                 
            var fileDefinition = definitionsService.selectedFileDefinition ||
                                        definitionsService.getFileDefinition(filename, data);
            $log.debug('FileParser - parsing with fileDefinition:', fileDefinition);
            
            if (!fileDefinition) {
                if (this.onError) {
                    this.onError('Unable to determine the file format for ' + filename);
                }                
                return;
            }
            
            var file = new File(filename, fileDefinition, data);
            
            if (fileDefinition.isFixedFormat()) {
                parseFixed(file, data);
            } else if (fileDefinition.isLengthPrefixed()) {
                // TODO Do length-prefixed (X9)
            } else {
                // Assume delimited
                parseDelimited(file, data, fileDefinition.fieldDelimiter || ',');
            }
        
            return file;
        };
        
        return FileParser;
        
    }]);
    
})(angular, 'jiffy.parser'); 