/**
 * @ngdoc controller
 * @name jiffy.controllers:NavBarController
 * @description 
 * # NavBarController 
 * Angular controller for home page navigation bar and its menus.
 */

(function() {
    'use strict';
    
    var owningModule = angular.module('jiffy');
    
    owningModule.controller('NavBarController', [ '$scope', '$uibModal', '$uiViewScroll', '$log', 'FileService', 'DefinitionsService', 
                                            function ($scope, $uibModal, $uiViewScroll, $log, fileService, definitionsService) {
        
        $scope.model = {};                                        
        $scope.model.isNavbarCollapsed = true;
        $scope.model.savedFilename = null;                                                
        $scope.model.savedFileUrl = null;
        $scope.model.searchField = '';                                        
                                                
        $scope.uiModel = fileService.uiModel;                                                    
                                                
        $scope.model.fileDefinitions = definitionsService.getFileDefinitions();         
                                                
        $scope.newFile = function(fileDefinition) {
            fileService.createEmptyFile(fileDefinition);
        };     
        
        $scope.openFile = function() {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/file-open.html',                
                controller: 'FileOpenController'
            });

            modalInstance.result.then(function(selectedFile) {
                $log.debug('NavBarController - File selected', selectedFile);               
                fileService.readFile(selectedFile)
                    .then(function(file) {
                        $log.debug('File read', file);
                    }, function(errorMsg, parm1, parm2) {
                        $log.error('Error reading file', errorMsg, parm1, parm2);
                        $scope.model.errorMessage = errorMsg;
                    });
            }, function () {
                $log.debug('NavBarController - File dialog dismissed');
            });
        };
                                                
        $scope.saveFileAs = function() {
          var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/file-save-as.html',                
                controller: 'FileSaveAsController',
                resolve: {
                    currentFilename: function() {
                        return $scope.uiModel.currentFile.name;
                    }
                }              
            });

            modalInstance.result.then(function(filename) {
                $log.debug('NavBarController - Save As dialog closed', filename);  
                $scope.uiModel.currentFile.name = filename;
                $scope.saveFile();
            }, function () {
                $log.debug('NavBarController - Save As dialog dismissed');
            });
        };                                              
        
        $scope.saveFile = function() {
            var file = $scope.uiModel.currentFile;
            if (file && file.name) {
                fileService.writeFile(file, function(savedFileUrl) {
                    $scope.model.savedFilename = file.name;                    
                    $scope.model.savedFileUrl = savedFileUrl;
                    $scope.$apply();
                    document.getElementById('download-link').click();                    
                });  
            } else {
                $log.debug('No file to save');
            }
        };
                                                
        $scope.findRecord = function(searchField, goForward) {
            var matchingRecord = this.uiModel.findRecord(searchField, goForward);
            if (matchingRecord) {
                var recordElement = document.getElementById(matchingRecord.elementId);
                if (recordElement) {        
                    $uiViewScroll(angular.element(recordElement));
                }
            }
        };                                              
                                                
        $scope.insertRecord = function(recordDefinition) {
            this.uiModel.insertRecord(recordDefinition);
        };
        $scope.deleteRecord = function() {
            this.model.errorMessage = this.uiModel.deleteSelectedRecord();          
        };      
        $scope.copyRecord = function() {
            this.model.errorMessage = this.uiModel.copySelectedRecord();   
        };                                                                             
                                              
    }]);
    
})();    