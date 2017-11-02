angular.module("dataManagement", [])
  .controller("personalData", function ($scope) {

    //账户部分初始化
    $scope.dataSets = [];
    $scope.provideSum = 0;
    $scope.requestSum = 0;
    /**
     * 页面加载完后自动显示第一个用户名
     */
    $scope.$watch('$viewContentLoaded', function () {

    });

    $scope.getCapability = function (dataName, requestT, requester) {
      if (!requestT) {
        alert("请输入数据密码！");
        return;
      }
      if (!isNameLengthLegal(requestT)) {
        alert("数据密码长度小于32字符！");
        return;
      }
      var cap = getCapability(dataName, requestT, requester);
      if (cap) {
        alert("The data access capability : " + cap);
        return;
      }
      alert("数据密码有误！");
    }
    /**
     * 获取个人数据列表
     */
    $scope.getPersonalDataList = function (address) {
      $scope.provideDataSet = getProvideDataList(address);
      $scope.provideSum = $scope.provideDataSet.length;
      $scope.requestDataSet = getRequestDataList(address);
      $scope.requestSum = $scope.requestDataSet.length;
    }


    $scope.refresh = function (address) {
      $scope.getPersonalDataList(address);
    };
  })
;

function getCapability(dataName, requestT, requester) {
  try {
    //获取对应名称的权限合约
    var accessContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(dataName));
    var cap = accessContractInstance.getCapability.call(formatBytes(requestT), {
      from: requester
    });
  } catch (err) {
    console.log(err);
    return "";
  }
  return cap;
}
