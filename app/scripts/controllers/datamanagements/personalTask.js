angular.module("personalTask", [])
  .controller("personalTask", function ($scope) {
    //账户部分初始化
    $scope.taskSets = [];
    $scope.provideSum = 0;
    $scope.requestSum = 0;
    /**
     * 页面加载完后自动显示第一个用户名
     */
    $scope.$watch('$viewContentLoaded', function () {

    });

    /**
     * 获取个人数据列表
     */
    $scope.getPersonalTaskList = function (address) {
      $scope.provideTaskSet = getProvideTaskList(address);
      $scope.provideSum = $scope.provideTaskSet.length;
      $scope.requestTaskSet = getRequestTaskList(address);
      $scope.requestSum = $scope.requestTaskSet.length;
    }


    $scope.refresh = function (address) {
      $scope.getPersonalTaskList(address);
    };
  })
;
