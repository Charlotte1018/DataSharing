angular.module("taskControl", [])
  .controller("taskControl", function ($scope) {
    $scope.requesters = [];

    /**
     * 页面加载
     */
    $scope.$watch('$viewContentLoaded', function () {
      $scope.getProvideTask($scope.selectedAccount.address);
      if (!$scope.selectedTask) {
        return;
      }
      $scope.getTaskRequestList($scope.selectedTask.taskName);
    });

    /**
     * 查询对应账户所提供的任务列表
     */
    $scope.getProvideTask = function (address) {
      $scope.taskSet = getProvideTaskList(address);
      if ($scope.taskSet && $scope.taskSet.length > 0) {
        $scope.selectedTask = $scope.taskSet[0];
        $scope.getTaskRequestList($scope.selectedTask.taskName);
      }
    };

    $scope.isTaskFinished = function (taskName) {
      return isTaskFinished(taskName);
    }
    $scope.endTask = function (provider, taskName, password) {
      if (!taskName || !password) {
        alert("请输入任务名和密码！");
        return;
      }
      if (endTask(provider, taskName, password)) {
        alert("结束任务成功！");
        return;
      }
      alert("结束任务失败！");
    }

    /**
     * 查询对应任务的提供者列表
     */
    $scope.getTaskRequestList = function (taskName) {
      $scope.requestList = getRequestListByTaskName(taskName);
    };

    /**
     * 确认任务请求
     */
    $scope.confirmTask = function (provider, password, taskName, requester) {
      if (!provider || !password || !taskName || !requester) {
        alert("请输入密码！");
        return;
      }
      if (isTaskAudited(taskName, requester)) {
        alert("该任务已经被审核！");
        return;
      }
      if (confirmTask(provider, password, taskName, requester)) {
        alert("确认任务请求成功！");
        return;
      }
      alert("确认任务请求失败！");
    };

    /**
     * 拒绝任务请求
     */
    $scope.rejectTask = function (provider, password, taskName, requester) {
      if (!provider || !password || !taskName || !requester) {
        alert("请输入密码！");
        return;
      }
      if (isTaskAudited(taskName, requester)) {
        alert("该任务已经被审核！");
        return;
      }
      if (rejectTask(provider, password, taskName, requester)) {
        alert("拒绝任务请求成功！");
        return;
      }
      alert("拒绝任务请求失败！");
    };
  });

/**
 * 确认任务
 * @param provider
 * @param password
 * @param taskName
 * @param requester
 * @returns {boolean}
 */
function confirmTask(provider, password, taskName, requester) {
  if (!provider || !password || !taskName || !requester) {
    return false;
  }
  if (!isTaskNameExist(taskName)) {
    return false;
  }
  if (isTaskAudited(taskName, requester)) {
    return false;
  }
  //判断是否是任务提供者
  var task = searchTaskByName(taskName);

  if (task.provider != getUserNameByAddress(provider)) {
    return false;
  }
  if (!unlockEtherAccount(provider, password)) {
    return false;
  }
  //调用函数确认任务请求
  try {
    contractInstance.confirmTask(taskName, requester, {
      from: provider,
      gas: 80000000
    });
  }
  catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

/**
 * 拒绝任务
 * @param provider
 * @param password
 * @param taskName
 * @param requester
 * @returns {boolean}
 */
function rejectTask(provider, password, taskName, requester) {
  if (!provider || !password || !taskName || !requester) {
    return false;
  }
  if (!isTaskNameExist(taskName)) {
    return false;
  }
  if (isTaskAudited(taskName, requester)) {
    return false;
  }
  //判断是否是任务提供者
  var task = searchTaskByName(taskName);
  if (task.provider != getUserNameByAddress(provider)) {
    return false;
  }
  if (!unlockEtherAccount(provider, password)) {
    return false;
  }
  //调用函数确认任务请求
  try {
    contractInstance.rejectTask(taskName, requester, {
      from: provider,
      gas: 80000000
    });
  }
  catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

/**
 * 结束任务
 * @param provider
 * @param password
 * @param taskName
 * @returns {boolean}
 */
function endTask(provider, password, taskName) {
  if (!provider || !password || !taskName) {
    return false;
  }
  if (!isTaskNameExist(taskName)) {
    return false;
  }
  //判断是否是任务提供者
  var task = searchTaskByName(taskName);
  if (task.provider != getUserNameByAddress(provider)) {
    return false;
  }
  if (!unlockEtherAccount(provider, password)) {
    return false;
  }
  //调用函数确认任务请求
  try {
    contractInstance.endTask(taskName, {
      from: provider,
      gas: 80000000
    });
  }
  catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

/**
 * 根据任务名称获取请求列表
 * @param taskName
 * @returns {Array}
 */
function getRequestListByTaskName(taskName) {
  var requestList = [];
  if (!taskName || !isTaskNameExist(taskName)) {
    alert("任务不存在！");
    return requestList;
  }
  try {
    //获取权限对象
    var accessContractInstance = accessContract.at(contractInstance.getTaskAccessByName.call(taskName));
    var requesterNum = accessContractInstance.requesterNum.call().toNumber();
    for (var i = 0; i < requesterNum; i++) {
      var request = getRequestTaskByName(taskName, accessContractInstance.requesterList(i));
      requestList.push(request);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return requestList;
}
