'use strict';
angular.module("provideTask", []).controller("provideTask", function ($scope) {
  //任务类型初始化
  $scope.tool_type = getToolType();
  $scope.purpose_type = getPurposeType();
  $scope.types = [];
  /**
   * 页面加载完后
   */
  $scope.$watch('$viewContentLoaded', function () {
  });

  /**
   * 创建任务
   */
  $scope.provideTask = function (address, password, taskName, introduction,
                                 select_tool_type, select_purpose_type) {
    if (!address || !password || !taskName || !introduction
      || !select_tool_type || !select_purpose_type) {
      alert("请填写完善信息！");
      return;
    }
    if (!isNameLengthLegal(taskName) || !isNameLengthLegal(select_tool_type) || !isNameLengthLegal(select_purpose_type)) {
      alert("任务名称、权限密码、类型相关字段不能超过32个字符且不为空字符串！");
      return;
    }
    if (isTaskNameExist(taskName)) {
      alert("任务名称已注册!");
      return;
    }
    //判断是否增加type并判断是否超过长度
    for (var i = 0; i < $scope.types.length; i++) {
      if (!$scope.types[i].key || !$scope.types[i].value) {
        alert("Please input the types params!");
        return;
      }
      if (!isNameLengthLegal($scope.types[i].key) || !isNameLengthLegal($scope.types[i].value)) {
        alert("类型相关字段不能超过32个字符且不为空字符串！！");
        return;
      }
    }
    //解锁
    if (!unlockEtherAccount(address, password)) {
      return;
    }
    //添加任务
    try {
      //添加任务源(两个参数待定)
      contractInstance.createTask(formatBytes(taskName), introduction, "test", "test", {
        from: address,
        gas: 80000000
      });
      //添加任务类型
      contractInstance.addTypeToTask(formatBytes($scope.tool_type.key), formatBytes(select_tool_type), formatBytes(taskName), {
        from: address,
        gas: 8000000
      });
      contractInstance.addTypeToTask(formatBytes($scope.purpose_type.key), formatBytes(select_purpose_type), formatBytes(taskName), {
        from: address,
        gas: 8000000
      });
      for (i = 0; i < $scope.types.length; i++) {
        contractInstance.addTypeToTask(formatBytes($scope.types[i].key), formatBytes($scope.types[i].value), formatBytes(taskName), {
          from: address,
          gas: 8000000
        });
      }
      alert("新增任务成功！");
      return true;
    } catch (err) {
      console.log(err);
      alert("新增任务失败!");
      return false;
    }
  };

  /**
   * 增加类型控件
   */
  $scope.addType = function () {
    $scope.types.push({key: "", value: ""});
  };
  /**
   * 删除类型控件
   */
  $scope.removeType = function () {
    if ($scope.types.length <= 0) {
      return;
    }
    $scope.types.splice($scope.types.length - 1, 1);
  };

  /**
   * 检查任务名称是否合法
   */
  $scope.checkProvideTaskNameLegal = function (taskName) {
    if (!taskName) {
      $scope.nameError = "Please input task name.";
      return;
    }
    if (isTaskNameExist(taskName)) {
      $scope.nameError = "The name is exist";
      return;
    }
    if (!isNameLengthLegal(taskName)) {
      $scope.nameError = "The length of taskName should less than 32 char and not null";
      return;
    }
    $scope.nameError = "";
  };

  /**
   * 查询对应账户所提供的任务列表
   */
  $scope.getProvideTask = function (provider) {
    $scope.taskSets = getProvideTaskList(provider);
  };
});

/**
 * 根据提供者返回任务列表
 * @param provider
 * @returns {Array}
 */
function getProvideTaskList(provider) {
  var taskSet = [];
  if (!provider || !isAddress(provider)) {
    return [];
  }
  try {
    //获取提供者提供的任务总数
    var provideNum = contractInstance.getTaskNumByProvider.call(provider).toNumber();
    //逐个获取任务对象
    for (var i = 0; i < provideNum; i++) {
      var task = [];
      task.taskName = web3.toAscii(contractInstance.getProvideTaskNameByIndex.call(provider, i));
      task = getProvideTask(task.taskName);
      taskSet.push(task);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return taskSet;
}

/**
 * 根据任务名称获取任务
 * @param taskName
 * @returns {Array}
 */
function getProvideTask(taskName) {
  var task = searchTaskByName(taskName);
  try {
    //获取对应名称的权限合约
    var accessContractInstance = accessContract.at(contractInstance.getTaskAccessByName.call(taskName));
    task.requestNumber = accessContractInstance.requesterNum();
  }
  catch (err) {
    console.log(err);
    return [];
  }
  return task;
}


