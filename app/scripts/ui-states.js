/**
 * Defines all ui-router states.
 */

(function() {
    'use strict';
    
    var app = angular.module('jiffy');
    
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
        $urlRouterProvider.otherwise('/');
 
        $stateProvider
            .state('home', {
                url:'/',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar.html',                        
                        controller: 'NavBarController'                        
                    },                    
                    'records': {
                        templateUrl: 'views/records-tree.html',
                        controller: 'RecordsController'                        
                    },
                    'recordDescription': {
                        templateUrl: 'views/record-description.html',
                        controller: 'RecordDescriptionController'                        
                    },
                    'fieldsList': {
                        templateUrl: 'views/fields-list.html',
                        controller: 'FieldsController'                        
                    },
                    'fieldDescription': {
                        templateUrl: 'views/field-description.html',
                        controller: 'FieldDescriptionController'                        
                    }                     
                }
            });
    }]);
    
})();    