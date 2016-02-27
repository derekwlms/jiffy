/**
 * @ngdoc object
 * @name jiffy.models:FileEditorModel
 * @description 
 * A UI model for the file editor state.
 */

(function(ng, module) {
    'use strict';
    
    ng.module(module).factory('FileEditorModel', function() {

        function FileEditorModel() {
            this.currentFile = null;
            this.selectedRecord = null;
            this.selectedField = null;            
        }

        FileEditorModel.prototype.selectRecord = function(record) {
            if (this.selectedRecord) {
                this.selectedRecord.validate();
                this.selectedRecord.isSelected = false;
            }
            record.isSelected = true;
            this.selectedRecord = record;    
            this.selectedField = record.fields[0];   
            this.selectedField.isSelected = true;
        };
        
        FileEditorModel.prototype.selectField = function(field) {
            if (this.selectedField) {
                this.selectedField.isSelected = false;
            }            
            field.isSelected = true;
            this.selectedField = field;         
        };
        
        FileEditorModel.prototype.clearSelection = function() {
            this.selectedRecord = null;    
            this.selectedField = null;   
        };        
        
        FileEditorModel.prototype.findRecord = function(searchString, goForward) {
                // Find the next record and field in the recordsTree that matches the given searchString.
                // Start after the currently-selected record. Select the matching record and return it.
            if (searchString && this.currentFile) {
                var firstMatch = this.currentFile.findRecord(searchString, goForward);
                if (firstMatch) {
                    this.selectRecord(firstMatch.record);
                    this.selectField(firstMatch.field);
                    return firstMatch.record;
                }
            }
        }; 
        
        FileEditorModel.prototype.insertRecord = function(recordDefinition) {
            var cf = this.currentFile;
            var parent = this.selectedRecord || cf.recordsTree[cf.recordsTree.length - 1]; 
            cf.insertRecord(parent, recordDefinition);
        };  
        
        FileEditorModel.prototype.deleteSelectedRecord = function() {
            if (this.selectedRecord) {
                this.currentFile.removeRecord(this.selectedRecord); 
                return null;                
            } else {
                return 'Select a record to delete.'; 
            }            
        };   
        
        FileEditorModel.prototype.copySelectedRecord = function() {            
            if (this.selectedRecord) {
                this.currentFile.duplicateRecord(this.selectedRecord);                
                return null;
            } else {
                return 'Select a record to copy.'; 
            }
        }; 
            
        return FileEditorModel;
    });        
    
})(angular, 'jiffy'); 