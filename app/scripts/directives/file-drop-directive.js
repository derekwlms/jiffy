/**
 * @ngdoc directive
 * @name jiffy.directives:FileDrop
 * @scope
 * @restrict A
 *
 * @description
 * Angular directive for handling file drag drops.
 *
 * @param {File=}   file       Receives the dropped File object.
 * @param {string=} fileName   Receives the dropped file's name.
 */

(function() {
    'use strict';
    
    var owningModule = angular.module('jiffy');
    
    owningModule.directive('fileDrop', ['$log', function ($log) {
        return {
            restrict: 'A',
            scope: {
                file: '=',
                fileName: '='
            },   
            link: function(scope, element) {   
                var handleDragOver = function(event) {
                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        event.dataTransfer.dropEffect = 'copy';
                    }
                };     
                var handleDrop = function(event) {
                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        var dt = event.dataTransfer || event.originalEvent.dataTransfer;
                        var files = dt.files;                       
                        if (files && files[0]) {
                            var file = files[0];
                            $log.debug('File dropped', file);  
                            scope.$apply(function() {    
                                scope.file = file;
                                scope.fileName = file.name;                             
                            });
                        }                        
                    }                                     
                };
                element.bind('dragover', handleDragOver);  
                element.bind('drop', handleDrop);                 
            }
        };
    }]);
})(); 