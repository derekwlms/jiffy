/**
 * @ngdoc controller
 * @name jiffy.controllers:FieldDescriptionController
 * @description 
 * # FieldDescriptionController 
 * Angular controller for the 'field description' pane.
 */

(function() {
    'use strict';
    
    var owningModule = angular.module('jiffy');
    owningModule.controller('FieldDescriptionController', [ '$scope', 'FileService', function ($scope, fileService) {
        $scope.model = {};
        
        $scope.uiModel = fileService.uiModel;        
    }]);
    
})();    