/**
 * @ngdoc controller
 * @name jiffy.controllers:RecordsController
 * @description
 * # RecordsController
 * Angular controller for the 'records list' navigation tree.
 */

(function() {
    'use strict';
    
    var owningModule = angular.module('jiffy');
    owningModule.controller('RecordsController', [ '$scope', 'FileService', 'FileEditorModel', 
                                                  function ($scope, fileService) {
        $scope.model = {};       
        $scope.uiModel = fileService.uiModel;
        
        $scope.showRecord = function(record) {
            this.uiModel.selectRecord(record);
        };
    }]);
    
})();    