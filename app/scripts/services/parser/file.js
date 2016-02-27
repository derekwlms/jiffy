/**
 * @ngdoc object
 * @name jiffy.parser.models:File
 * @description 
 * An in-memory representation of a data file. It includes its records and any file-level validation problems.
 */

(function(ng, module) {
    'use strict';
    
    ng.module(module).factory('File', [ '_', 'FileDefinition', 'Record', function(_, FileDefinition, Record) {
    
        function File(name, fileDefinition, data) {
            this.name = name || '(unnamed)';
            this.fileDefinition = fileDefinition || new FileDefinition();
            this.data = data || '';

            // TODO remove records - it's only used for addRecord. All others use recordsTree.
            this.records = [];
            this.recordsTree = [];            
            
            this.currentRecordId = 1;
        }

        File.prototype.addRecord = function(data, dataArray, recordNumber) {
                // Add a new record to this file using the fields in either data (unparsed) or dataArray (parsed).
            var signature = dataArray ? dataArray[0] : data;
            if (!signature) {
                return;
            }
            var recordDef = this.fileDefinition.getRecordDefinition(signature, recordNumber);
            var record = new Record(recordDef, dataArray || data);
            if (dataArray) {
                record.addFields(dataArray);                
            } else {
                record.parseFields();                
            }
            record.setId(this.currentRecordId++);
            this.records.push(record);            
            var parent = null;
            if (recordDef.parent) {
                parent = _.findLast(this.records, function(rec) {
                    return rec.recordDefinition.type === recordDef.parent;
                });
            }
            record.validate();
            if (parent) {
                parent.addChild(record);
            } else {
                this.recordsTree.push(record);
            }
        };          
        
        File.prototype.removeRecord = function(record) {
            if (record && record.parent) {
                var index = record.parent.children.indexOf(record);
                record.parent.children.splice(index, 1);
            }               
        };      
        File.prototype.duplicateRecord = function(record) {
            if (record) {
                var newRecord = ng.copy(record); //_.clone(record); 
                newRecord.id = this.currentRecordId++;   
                newRecord.children = [];
                if (record.parent) {
                    if (!record.parent.children) {
                        record.parent.children = [];
                    }
                    var index = record.parent.children.indexOf(record);
                    if (index === -1) {
                        index = parent.children.length - 1;
                    }
                    record.parent.children.splice(index + 1, 0, newRecord);                    
                } else {
                    var parentIndex = this.recordsTree.indexOf(record);                    
                    this.recordsTree.splice(parentIndex, 0, newRecord);
                }
            }               
        };           
        File.prototype.insertRecord = function(parent, recordDefinition) {        
            var record = new Record(recordDefinition);
            record.createFields();
            record.setId(this.currentRecordId++);            
            if (!this.recordsTree[0]) {
                // this.recordsTree.splice(0, this.recordsTree.length);
                // this.recordsTree.push.apply(this.recordsTree, [ record ]);     
                this.recordsTree.splice(0, 0, record);
            } else {
                parent = parent || this.recordsTree[this.recordsTree.length - 1];
                record.parent = parent;
                parent.children.push(record);
            }                      
        };    
        
        File.prototype.getOrderedRecords = function() {
                // Return the records in the recordsTree in an ordered, flat array
            return _.reduce(this.recordsTree, function(array, record) {
                return array.concat(record.getOrderedRecords());
            }, []);            
        };          
        
        File.prototype.findRecords = function(testFunction) {
            // Find and return all my records (and my children's records) that 
            // satisfy the given function (returning an non-null value).
            return _.reduce(this.recordsTree, function(array, record) {
                return array.concat(record.findRecords(testFunction));
            }, []);        
        };            
        
        File.prototype.findRecord = function(searchString, goForward) {
            // Return the next record and field in the recordsTree that matches the given string                
            var needle = new RegExp(searchString, 'i'); 
            var firstMatch, beforeMatch, selected, afterMatch, lastMatch;
            this.findRecords(function(rec) {
                var matchingField = rec.findField(needle);
                var match = { record: rec, field: matchingField };
                if (matchingField && !rec.isSelected) {
                    firstMatch = firstMatch || match;
                    lastMatch = match;
                    if (selected) {
                        afterMatch = afterMatch || match;                    
                    } else {
                        beforeMatch = match;
                    }
                }
                if (rec.isSelected) {
                    var selectedField = _.find(rec.fields, function(fld) { 
                        return fld.isSelected; });
                    selected = { record: rec, field: selectedField };
                }
                return null;
            });
            return goForward ? (afterMatch || firstMatch || beforeMatch) : 
                                (beforeMatch || lastMatch || afterMatch);
        };          

        return File;
    
    }]);
    
})(angular, 'jiffy.parser'); 