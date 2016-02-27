/**
 * @ngdoc overview
 * @name jiffy
 * @description
 * Jiffy uses two modules:
 * - jiffy.parser - Parses files.  Uses metadata objects that define file, record, and field formats.
 * - jiffy - The Jiffy user interface.
 */

(function() {
    'use strict';
    
    angular.module('jiffy.parser', []);

    angular
        .module('jiffy', [
            'jiffy.parser',
            'ui.bootstrap',
            'ui.router',
            'ngAria',
            'ngMessages',
            'ngSanitize',
            'ngTouch'])
        .constant('_', window._)                // lodash or underscorejs
        .constant('MAX_FILE_SIZE', 2 * 1024 * 1024) // In bytes
        .config(['$compileProvider', '$logProvider', function(compileProvider, logProvider) {
                                                // Allow filesystem: anchors for download
            compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|filesystem):/);            
            logProvider.debugEnabled(false);     // Set true for development
        }])
        .run(['DefinitionsService', function(definitionsService) {
            definitionsService.loadDefinitions(
                'file-definitions/', 
                'definition-names.txt');           
        }]);

})();
