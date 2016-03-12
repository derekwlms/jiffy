/**
 * @ngdoc service
 * @name jiffy.services:FileService
 * @description
 * # FileService
 * Angular service for manipulating files - loading them, storing them, and managing them in memory.
 */

(function(ng, module) {
    'use strict';
    
    var owningModule = ng.module(module);
    
    owningModule.service('FileService', ['$q', '$log', '$window', 'MAX_FILE_SIZE', 'FileParser', 'FileFormatter', 'File', 'FileEditorModel',
                                         function ($q, $log, $window, MAX_FILE_SIZE, FileParser, FileFormatter, File, FileEditorModel) {  

        // Later do controller scope inheritence and let the controllers keep/share uiModel instead of here
        var uiModel = new FileEditorModel();

        var readFile = function(file) {
                // Parse the file and update my in-memory list of records and fields
            
            uiModel.clearSelection();       
            
            $log.debug('FileService.readFile', file);       
            var deferred = $q.defer();
            
            // Later maybe also validate also file.type

            var reader = new FileReader();
            
            reader.onload = function(event) {

                var text = event.target.result;
                var fileParser = new FileParser();
                fileParser.onError = function(err) {                  
                    $log.error('File parse error', err);
                    deferred.reject(err || 'File parse error');
                };
                var parsedFile = fileParser.parseText(file.name, text);
                if (parsedFile) {
                    $log.debug(parsedFile);
                }
                uiModel.currentFile = parsedFile;
                deferred.resolve(parsedFile);
            };
            reader.onerror = function(event) {      
                // Map error.code to a message? Wouldn't get NOT_FOUND_ERR, but might get NOT_READABLE_ERR or ABORT_ERR.
                $log.error('File read error', event, event.target.error.code);
                deferred.reject('File read error', event, event.target.error.code);
            };
            reader.onprogress = function(event) {
                // Maybe later add a progress indicator.  Might use a Bootstrap progress bar or Angular spinner / throbber
                $log.debug('File read progress', event);
            };
            reader.onabort = function(event) {
                // Maybe later add a cancel option.
                $log.debug('File read cancelled', event);
                deferred.reject('File read cancelled', event);                
            };

            // Read the file into memory call the onload function when done.
            // Maybe later support very large files and add slicing (async reads).
            // reader.readAsDataURL(file);
            // reader.readAsBinaryString(file);
            reader.readAsText(file);
            
            return deferred.promise;
        };     
        
        var getFileSystem = function(successCallback, errorCallback) {
            var requestFileSystem = $window.requestFileSystem || $window.webkitRequestFileSystem;
            requestFileSystem($window.TEMPORARY, MAX_FILE_SIZE, successCallback, function(error) {
                $log.error('Error getting file system for writing', error);  
                if (errorCallback) {
                    var detail = error.name ? ' (' + error.name + ').' : '.';
                    errorCallback('Unable to save file - error getting file system for writing' + detail);
                }
            });            
        };        
        
        var writeFile = function(file, successCallback, errorCallback) {
            // Save the current file to browser FileSystem temporary storage (for subsequent download).
            // To see FileSystem in F12, use chrome://flags, then Enable Developer Tools Experiments, 
            // then Settings - Experiments - FileSystem inspection
            
            var filename = file.name;
            var fileFormatter = new FileFormatter();
            var content = fileFormatter.formatText(file);  // file.data          
            
            getFileSystem(function(fileSystem) {
                fileSystem.root.getFile(filename, {create: true}, function(fileEntry) {

                    fileEntry.createWriter(function(fileWriter) {

                        fileWriter.onwriteend = function() {                            
                            $log.debug('File saved', filename, fileEntry.toURL());
                            if (successCallback) {
                                successCallback(fileEntry.toURL());
                            }
                        };
                        fileWriter.onerror = function(error) {
                            $log.error('Write error', error);
                        };

                        // Later handle binary
                        var contentBlob = new Blob([content], {type: 'text/plain'});
                        fileWriter.write(contentBlob);

                    }, function(error) {
                        $log.error('Error creating file writer', error);
                    });

                }, function(error) {
                    $log.error('Error creating file', error);
                });  
            }, errorCallback);
        };  
                                             
        var createEmptyFile = function(fileDefinition) {      
            uiModel.currentFile = new File('(unnamed)', fileDefinition, []);
            uiModel.clearSelection();                      
        };                                                

        // "Exports":
        return {
            createEmptyFile: createEmptyFile,              
            readFile: readFile,
            writeFile: writeFile,
            uiModel: uiModel
        };
    }]);
    
})(angular, 'jiffy'); 