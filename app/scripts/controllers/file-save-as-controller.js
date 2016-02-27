/**
 * @ngdoc controller
 * @name jiffy.controllers: FileSaveAsController
 * @description
 * # FileSaveAsController
 * Angular controller for the file->save as dialog.
 */

(function() {
    'use strict';
    
    var owningModule = angular.module('jiffy');
    owningModule.controller('FileSaveAsController', [ '$scope', '$uibModalInstance', '$window', '$log', 'currentFilename', 
                                                   function ($scope, $uibModalInstance, $window, $log, currentFilename) {
                                                                                                            
        $log.debug('FileSaveAsController init');
        $scope.model = {};
        $scope.model.filename = currentFilename;
        $scope.model.isFileApiAvailable = $window.File && 
                            $window.FileReader && $window.FileList && $window.Blob;                                                       

        $scope.ok = function () {      
            $uibModalInstance.close(this.model.filename);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };  
        
    }]);
})();    