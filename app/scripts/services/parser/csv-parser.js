/**
 * @ngdoc object
 * @name jiffy.parser.models:CsvParser
 * @description 
 * A CSV Parser, from Ben Nadel's CSVToArray, http://www.bennadel.com.
 */

(function(ng, module) {
    'use strict';
    
    ng.module(module).factory('CsvParser', function() {

        function CsvParser() { }

        CsvParser.prototype.csvToArray = function(strData, strDelimiter) {
            strDelimiter = strDelimiter || ',';
            var objPattern = new RegExp(
                (
                    // Delimiters.
                    '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +
                    // Quoted fields.
                    '(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|' +
                    // Standard fields.
                    '([^\"\\' + strDelimiter + '\\r\\n]*))'
                ),
                'gi'
                );

            var arrData = [[]];
            var arrMatches = null;

            while (arrMatches = objPattern.exec( strData )){
                // Get the delimiter that was found.
                var strMatchedDelimiter = arrMatches[ 1 ];
                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (
                    strMatchedDelimiter.length &&
                    (strMatchedDelimiter != strDelimiter)
                    ){
                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push( [] );
                }
                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                var strMatchedValue = null;
                if (arrMatches[ 2 ]){
                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    strMatchedValue = arrMatches[ 2 ].replace(
                        new RegExp( '\"\"', 'g' ),
                        '\"'
                        );
                } else {
                    // We found a non-quoted value.
                    strMatchedValue = arrMatches[ 3 ];
                }
                // Now that we have our value string, let's add
                // it to the data array.
                arrData[ arrData.length - 1 ].push( strMatchedValue );
            }

            return arrData;
        };        

        return CsvParser;
        
    });        
    
})(angular, 'jiffy.parser'); 