'use strict';

/**
 * @ngdoc function
 * @name uiRouterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uiRouterApp
 */
angular.module('ctrlModule', [])
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
  .controller('login', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  });
