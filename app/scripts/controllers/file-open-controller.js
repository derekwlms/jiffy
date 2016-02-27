/**
 * @ngdoc controller
 * @name jiffy.controllers: FileOpenController
 * @description
 * # FileOpenController
 * Angular controller for the file->open dialog.
 */

(function() {
    'use strict';
    
    var owningModule = angular.module('jiffy');
    owningModule.controller('FileOpenController', [ '$scope', '$uibModalInstance', '$window', '$log', 'MAX_FILE_SIZE', 'DefinitionsService', 
                                                   function ($scope, $uibModalInstance, $window, $log, MAX_FILE_SIZE, definitionsService) {
                                                                                                            
        
        $log.debug('FileOpenController init');
        $scope.model = {};
        $scope.model.isFileApiAvailable = $window.File && $window.FileReader && $window.FileList && $window.Blob;
        $scope.model.fileDefinitions = definitionsService.getFileDefinitions();
        $scope.model.fileAcceptTypes = definitionsService.getFileAcceptTypes();  
              
        $scope.fileSelected = function(file) {
            $log.debug('File selected: ', file);
            $scope.model.errorMessage = null;
            $scope.model.selectedFileDefinition = null;
            $scope.model.selectedFile = file;
            $scope.model.selectedFileName = file.name;   
            if (file.size > MAX_FILE_SIZE) {
                $log.debug('File too large', file, MAX_FILE_SIZE);
                // Later move message text out to a messages file with support for templates/parameters and i18n
                $scope.model.errorMessage = 'File too large.  Files must be less than 2 MB for reasonable browser performance.';
            } else { 
                // Later maybe also validate also file.type                
                // Later read the first few bytes of the file for matching based on data signature
                $scope.model.selectedFileDefinition = definitionsService.getFileDefinition(file.name);
                // Maybe later disable OK (and display a message) if it's an unknown file type                
            }
            $scope.$apply();
        };
        $scope.ok = function () {
            definitionsService.selectedFileDefinition = $scope.model.selectedFileDefinition;            
            $uibModalInstance.close($scope.model.selectedFile);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };  
        
    }]);
})();    