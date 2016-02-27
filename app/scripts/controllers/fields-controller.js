/**
 * @ngdoc controller
 * @name jiffy.controllers: FieldsController
 * @description
 * # FieldsController
 * Angular controller for the 'fields list'.
 */

(function() {
    'use strict';
    
    var owningModule = angular.module('jiffy');
    owningModule.controller('FieldsController', [ '$scope', 'FileService', function ($scope, fileService) {
        $scope.model = {};
        
        $scope.uiModel = fileService.uiModel;        
        
        $scope.showField = function(field) {
            this.uiModel.selectField(field);       
        };        
    }]);
    
})();    