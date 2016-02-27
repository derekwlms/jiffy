/**
 * Jasmine unit tests for NavBarController.
 */

'use strict';

describe('Controller: NavBarController', function () {

  // load the controller's module
  beforeEach(module('jiffy'));

  var navbarController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    navbarController = $controller('NavBarController', {
      $scope: scope
    });
  }));

  it('Initializes the scope', function () {
    expect(scope.model).toBeDefined();
    expect(scope.model.searchField).toBe('');
    expect(scope.model.fileDefinitions).toBeDefined();      
  });
    
  it('Creates new files', function () {
    scope.newFile({});
    expect(scope.uiModel.currentFile).toBeDefined();
  });
    
  it('inserts records', function () {
    scope.newFile({});
    scope.insertRecord({});
    expect(scope.uiModel.currentFile.recordsTree.length).toBe(1);
  });
        
});
