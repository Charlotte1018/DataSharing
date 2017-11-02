'use strict';
angular.module('mainrouter', [
  'ctrlModule',
  'accounts',
  'dataManagement',
  'dataControl',
  'taskControl',
  'personalTask',
  'provideData',
  'provideTask',
  'requestData',
  'requestTask',
  'searchData',
  'searchTask',
  'login',
  'config',
  'task',
  'data',
  'transactions'
])
  .config(function ($stateProvider) {
    $stateProvider
      .state("app", {
        url: "/app",
        templateUrl: "views/blockchain/main.html",
        controller: 'accounts'
      })
      .state('app.home', {
        url: '/home',
        views: {
          "content": {
            templateUrl: 'views/blockchain/home.html',
            controller: 'config'
          }
        }
      })
      .state('app.accountsList', {
        url: '/accountsList',
        views: {
          "content": {
            templateUrl: 'views/blockchain/accounts/accountsList.html',
            controller: 'accounts'
          }
        }
      })
      .state('app.chargeAccount', {
        url: '/chargeAccount',
        views: {
          "content": {
            templateUrl: 'views/blockchain/accounts/chargeAccount.html',
            controller: 'accounts'
          }
        }
      })
      .state('app.createAccount', {
        url: '/createAccount',
        views: {
          "content": {
            templateUrl: 'views/blockchain/accounts/createAccount.html',
            controller: 'accounts'
          }
        }
      })
      .state('app.getBalance', {
        url: '/getBalance',
        views: {
          "content": {
            templateUrl: 'views/blockchain/accounts/getBalance.html',
            controller: 'accounts'
          }
        }
      })
      .state('app.registerAccounts', {
        url: '/registerAccounts',
        views: {
          "content": {
            templateUrl: 'views/blockchain/accounts/registerAccounts.html',
            controller: 'accounts'
          }
        }
      })
      .state('app.registerAccountsList', {
        url: '/registerAccountsList',
        views: {
          "content": {
            templateUrl: 'views/blockchain/accounts/registerAccountsList.html',
            controller: 'accounts'
          }
        }
      })
      .state('app.personalDataList', {
        url: '/personalDataList',
        views: {
          "content": {
            templateUrl: 'views/blockchain/management/personalDataList.html',
            controller: 'personalData'
          }
        }
      })
      .state('app.personalTaskList', {
        url: '/personalTaskList',
        views: {
          "content": {
            templateUrl: 'views/blockchain/management/personalTaskList.html',
            controller: 'personalTask'
          }
        }
      })
      .state('app.personalDataControl', {
        url: '/dataControl',
        views: {
          "content": {
            templateUrl: 'views/blockchain/management/dataControl.html',
            controller: 'dataControl'
          }
        }
      })
      .state('app.personalTaskControl', {
        url: '/personalTaskControl',
        views: {
          "content": {
            templateUrl: 'views/blockchain/management/taskControl.html',
            controller: 'taskControl'
          }
        }
      })
      .state('app.provideData', {
        url: '/provideData',
        views: {
          "content": {
            templateUrl: 'views/blockchain/provides/provideData.html',
            controller: 'provideData'
          }
        }
      })
      .state('app.provideTask', {
        url: '/provideTask',
        views: {
          "content": {
            templateUrl: 'views/blockchain/provides/provideTask.html',
            controller: 'provideTask'
          }
        }
      })

      .state('app.provideDataList', {
        url: '/provideDataList',
        views: {
          "content": {
            templateUrl: 'views/blockchain/provides/provideDataList.html',
            controller: 'provideData'
          }
        }
      })
      .state('app.provideTaskList', {
        url: '/provideTaskList',
        views: {
          "content": {
            templateUrl: 'views/blockchain/provides/provideTaskList.html',
            controller: 'provideTask'
          }
        }
      })
      .state('app.requestData', {
        url: '/requestData',
        views: {
          "content": {
            templateUrl: 'views/blockchain/requests/requestData.html',
            controller: 'requestData'
          }
        }
      })
      .state('app.requestTask', {
        url: '/requestTask',
        views: {
          "content": {
            templateUrl: 'views/blockchain/requests/requestTask.html',
            controller: 'requestTask'
          }
        }
      })
      .state('app.requestDataList', {
        url: '/requestDataList',
        views: {
          "content": {
            templateUrl: 'views/blockchain/requests/requestDataList.html',
            controller: 'requestData'
          }
        }
      })
      .state('app.requestTaskList', {
        url: '/requestTaskList',
        views: {
          "content": {
            templateUrl: 'views/blockchain/requests/requestTaskList.html',
            controller: 'requestTask'
          }
        }
      })
      .state('app.searchData', {
        url: '/searchData',
        views: {
          "content": {
            templateUrl: 'views/blockchain/searches/searchData.html',
            controller: 'searchData'
          }
        }
      })
      .state('app.searchDataRequest', {
        url: '/searchDataRequest',
        views: {
          "content": {
            templateUrl: 'views/blockchain/searches/searchDataRequest.html',
            controller: 'searchData'
          }
        }
      })
      .state('app.searchTask', {
        url: '/searchTask',
        views: {
          "content": {
            templateUrl: 'views/blockchain/searches/searchtask.html',
            controller: 'searchTask'
          }
        }
      })
      .state('app.searchTaskRequest', {
        url: '/searchTaskRequest',
        views: {
          "content": {
            templateUrl: 'views/blockchain/searches/searchTaskRequest.html',
            controller: 'searchTask'
          }
        }
      })
      .state('app.searchTransByAccount', {
        url: '/searchTransByAccount',
        views: {
          "content": {
            templateUrl: 'views/blockchain/transactions/searchTrans.html',
            controller: 'transactions'
          }
        }
      })
      .state('app.etherTrans', {
        url: '/etherTrans',
        views: {
          "content": {
            templateUrl: 'views/blockchain/transactions/etherTrans.html',
            controller: 'transactions'
          }
        }
      })
      .state('app.dataList', {
        url: '/data',
        views: {
          "content": {
            templateUrl: 'views/blockchain/searches/DataList.html',
            controller: 'data'
          }
        }
      })
      .state('app.taskList', {
        url: '/taskList',
        views: {
          "content": {
            templateUrl: 'views/blockchain/searches/taskList.html',
            controller: 'task'
          }
        }
      })
      .state('app.login', {
        url: '/login',
        views: {
          "content": {
            templateUrl: 'views/user/login.html',
            controller: 'login'
          }
        }
      });
  });
