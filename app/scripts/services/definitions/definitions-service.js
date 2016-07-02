/**
 * @ngdoc service
 * @name jiffy.parser.services:DefinitionsService
 * @description
 * Angular service for loading and using file format definitions.
 */

(function(ng, module) {
    'use strict';
    
    ng.module(module).service('DefinitionsService', ['$http', '$log', '_', 'FileDefinition', 
                                                     function ($http, $log, _, FileDefinition) {
        
        var fileDefinitions = [];
        
        var loadFile = function(filename, loadCallback) {
            // Load a file asynchronously.
            // We're deliberately not using the full jQuery nor require.js,
            // so getJSON and require are not available. Use $http directly instead.
                        
            $http.get(filename)
                .success(function(data) {
                    loadCallback(data, filename);
                })
                .error(function(error) {
                    $log.error('Unable to read file / definition', filename, error);                  
                });           
        };   
        
        var loadDefinition = function(path, definitionFilename, descriptionFilename) {  
            // Load the given file definition.  When done, add it it my fileDefinitions list.
            // Also load the optional descriptionFilename, if available.
             loadFile(path + definitionFilename, function(def, fn) {
                if (def) {
                    $log.debug('Read file definition', fn, def);     
                    var fileDef = new FileDefinition(def);
                    fileDefinitions.push(fileDef);
                    fileDefinitions.sort(function(def1, def2) {
                        return def1.displayString.localeCompare(def2.displayString);
                    });
                    if (descriptionFilename) {
                        loadFile(path + descriptionFilename, function(data, fn) {
                            var descriptions = data.split(/\r?\n:/);                            
                            $log.debug('Read description file for definition', fn, fileDef, descriptions); 
                            fileDef.addDescriptions(descriptions);
                        });
                    }
                }
            });
        };        
        
        var loadDefinitions = function(path, listFilename) {    
            // Load all file definitions that are listed within the listFilename file.
            // Each entry in this file has the name of a JSON definition file and an optional descriptions file.
            loadFile(path + listFilename, function(data, fname) {
                var lines = data.split(/\r?\n/);
                $log.debug('Read file definition list', fname, lines);
                for (var i=0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line && line[0] !== '/') {
                        var names = line.split(/\s+/);
                        if (names[0]) {
                            loadDefinition(path, names[0], names[1]);
                        }
                    }
                }
            });
        };        
        
        var getFileDefinition = function(filename, initialData) {
            // Return the file definition that best matches the given filename.
            // Return null if no good match is found.
            // First try a match based on file suffix, then on data signature 
            var index;
            for (index in fileDefinitions) {
                if (fileDefinitions[index].matchesFilename(filename)) {
                    return fileDefinitions[index];
                }
            }
            if (initialData) {
                for (index in fileDefinitions) {
                    if (fileDefinitions[index].matchesSignature(initialData)) {
                        return fileDefinitions[index];
                    }
                }                  
            }
            return null;
        };
        var getFileDefinitions = function() {
            return fileDefinitions;
        };        
        
        var getFileAcceptTypes = function() {
            // Return a string listing all supported file type suffixes separated by commas.
            var str = '';
            _.each(fileDefinitions, function(fd) {
                _.each(fd.suffixes, function(sfx) {
                    str += (str ? ',.' : '.') + sfx; 
                });
                
            });
            return str;
        };        

        // "Exports":
        return {
            getFileAcceptTypes: getFileAcceptTypes,                
            getFileDefinition: getFileDefinition,
            getFileDefinitions: getFileDefinitions,
            loadDefinitions: loadDefinitions            
        };
    }]);
    
})(angular, 'jiffy.parser'); 