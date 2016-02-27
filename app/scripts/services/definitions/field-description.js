/**
 * @ngdoc object
 * @name jiffy.parser.models:FieldDescription
 * @description 
 * Defines a field or record description entry within a file descriptions text file.
 * Field descriptions can be loaded from text files and then used to supplement 
 * the file and record definitions taken from JSON files.
 * This avoids "cluttering" the JSON files with long description texts.
 */

(function(ng, module) {
    'use strict';
    
    function FieldDescription(string) {
        string = string || {};
        
        var i = string.indexOf(' ');
        var tag = string.slice(0, i);
        var ids = tag.split('-');
        
        this.recordTypeCode = ids[0] || '';
        this.fieldIndex = ids[1] || '';
        this.text = string.slice(i+1, string.length);
        // this.text = this.text.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }     
    
    FieldDescription.prototype.isRecordDescription = function() {
        return !this.fieldIndex;
    };
    FieldDescription.parseDescription = function(string) {
        var fd = null;
        if (string && string.match(/^\d/)) {
            fd = new FieldDescription(string);
        }
        return fd && fd.recordTypeCode ? fd : null;
    };    
    
    ng.module(module).factory('FieldDescription', function() {
        return FieldDescription; });    
    
})(angular, 'jiffy.parser'); 