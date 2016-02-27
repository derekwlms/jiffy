/**
 * @ngdoc controller
 * @name jiffy.controllers:RecordDescriptionController
 * @description 
 * # RecordDescriptionController 
 * Angular controller for the 'record description' pane.
 */

(function() {
    'use strict';
    
    var owningModule = angular.module('jiffy');
    
    owningModule.controller('RecordDescriptionController', [ '$scope', 'FileService', function ($scope, fileService) {
        $scope.model = {};
        
        $scope.uiModel = fileService.uiModel;
    }]);
    
})();    