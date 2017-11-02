angular.module("requestTask", []).controller("requestTask", function ($scope) {

  /**
   * 页面加载完后
   */
  $scope.$watch('$viewContentLoaded', function () {
  });

  /**
   * 请求任务
   */
  $scope.requestTask = function (taskName, requester, password, information) {
    if (!taskName || !requester || !password || !information) {
      alert("请完备信息！");
      return;
    }
    if (!isNameLengthLegal(taskName)) {
      alert("任务名不能为空或者大于32字符！");
      return;
    }
    //解锁账户
    if (!unlockEtherAccount(requester, password)) {
      return;
    }
    if (requestTask(taskName, requester, password, information)) {
      alert("请求成功！");
      return;
    }
    alert("请求失败！");
  };

  /**
   * 获取对应请求者请求任务列表
   */
  $scope.getTaskRequestList = function (requester) {
    if (!isAddress(requester)) {
      return;
    }
    $scope.taskSet = getRequestTaskList(requester);
  };

  /**
   * 更新请求备注
   */
  $scope.updateInfo = function (taskName, requester, password, information) {
    if (!taskName || !requester || !password || !information) {
      alert("请完备信息！");
      return;
    }
    if (!isNameLengthLegal(taskName)) {
      alert("任务名称长度不能超过32字符！");
      return;
    }

    if (!isTaskNameExist(taskName)) {
      alert("任务名不存在！");
      return;
    }
    if (!isTaskRequested(taskName, requester)) {
      alert("尚未请求该任务！");
      return;
    }
    if (isTaskAudited(taskName, requester)) {
      alert("任务尚已被审核，不可修改！");
      return;
    }
    if (updateTaskInformation(taskName, requester, password, information)) {
      alert("更新成功！");
      return;
    }
    alert("更新失败！");
  };
});

/**
 * 根据请求者返回任务列表
 * @param requster
 * @returns {Array}
 */
function getRequestTaskList(requester) {
  var taskSet = [];
  try {
    //获取请求任务数量
    var requestTaskNum = contractInstance.getTaskNumByRequester.call(requester).toNumber();
    for (var i = 0; i < requestTaskNum; i++) {
      //获取任务名称
      var task = [];
      task.taskName = web3.toAscii(contractInstance.getRequestTaskNameByIndex.call(requester, i));
      task = getRequestTaskByName(task.taskName, requester);
      //存入任务
      taskSet.push(task);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return taskSet;
}

/**
 * 请求任务
 * @param taskName
 * @param requester
 * @param password
 * @param information
 * @returns {boolean}
 */
function requestTask(taskName, requester, password, information) {
  if (!isRequestTaskNameLegal(taskName, requester)) {
    return false;
  }
  try {
    //解锁账户
    if (!unlockEtherAccount(requester, password)) {
      return false;
    }
    //发送请求(一个参数待定)
    contractInstance.requestTask(taskName, "test", information, {
      from: requester,
      gas: 80000000
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

/**
 * 返回请求的任务名称是否合法
 * @param taskName
 * @param requester
 * @returns {boolean}
 */
function isRequestTaskNameLegal(taskName, requester) {
  if (!taskName || !isAddress(requester)) {
    alert("任务名称与请求者地址不能为空！");
    return false;
  }
  if (!isTaskNameExist(taskName)) {
    alert("该任务不存在！");
    return false;
  }
  if (isTaskRequested(taskName, requester)) {
    alert("该任务已经被该账户请求！");
    return false;
  }
  if (isTaskFinished(taskName)) {
    alert("该任务已经结束！");
    return false;
  }
  //判断是否与任务名称相同
  var task = searchTaskByName(taskName);
  if (getUserAddressByName(task.provider) == requester) {
    alert("不能申请自己提供的任务！");
    return false;
  }
  return true;
}


/**
 * 根据请求者返回任务列表
 * @param requster
 * @returns {Array}
 */
function getRequestTaskList(requester) {
  var taskSet = [];
  try {
    //获取请求任务数量
    var requestTaskNum = contractInstance.getTaskNumByRequester.call(requester).toNumber();
    for (var i = 0; i < requestTaskNum; i++) {
      //获取任务名称
      var task = [];
      task.taskName = web3.toAscii(contractInstance.getRequestTaskNameByIndex.call(requester, i));
      task = getRequestTaskByName(task.taskName, requester);
      //存入任务
      taskSet.push(task);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return taskSet;
}

/**
 * 根据任务名称获取请求任务信息及状态
 * @param taskName
 * @returns {Array}
 */
function getRequestTaskByName(taskName, requester) {
  var task = [];
  try {
    //获取任务基本信息
    task = searchTaskByName(taskName);
    //获取对应名称的权限合约
    var accessContractInstance = accessContract.at(contractInstance.getTaskAccessByName.call(taskName));
    task.requesterName = getUserNameByAddress(requester);
    task.requester = requester;
    task.requestNumber = accessContractInstance.requesterNum();
    //获取当前状态
    task.status = accessType[accessContractInstance.accessList(accessContractInstance.requestList(requester))];
    //如果没有请求过，返回空
    if (task.status == accessType[0]) {
      return [];
    }
    //获取当前请求备注信息
    var requestContractInstance = requestContract.at(contractInstance.getTaskRequest.call(taskName, requester));
    task.information = requestContractInstance.information();
  } catch (err) {
    console.log(err);
    return [];
  }
  return task;
}

/**
 * 返回是否已经请求过该任务
 * @param taskName
 * @param requester
 * @returns {boolean}
 */
function isTaskRequested(taskName, requester) {
  var task = getRequestTaskByName(taskName, requester);
  if (task) {
    //判断是否已经审核
    return (task.status == accessType[1] || task.status == accessType[2] || task.status == accessType[3]);
  }
  return false;
}

/**
 * 返回对应任务是否已经被确认或者拒绝
 * @param taskName
 * @param requester
 * @returns {boolean}
 */
function isTaskAudited(taskName, requester) {
  var task = getRequestTaskByName(taskName, requester);
  if (task) {
    //判断是否已经审核
    return (task.status == accessType[2] || task.status == accessType[3]);
  }
  return false;
}

/**
 * 更新请求备注
 * @param taskName
 * @param requester
 * @param password
 * @param information
 * @returns {boolean}
 */
function updateTaskInformation(taskName, requester, password, information) {
  if (!taskName || !requester || !password || !information || !isNameLengthLegal(taskName)) {
    return false;
  }
  if (!isTaskNameExist(taskName)) {
    return false;
  }
  if (!isTaskRequested(taskName, requester)) {
    return false;
  }
  if (isTaskAudited(taskName, requester)) {
    return false;
  }

  try {
    //解锁账户
    if (!unlockEtherAccount(requester, password)) {
      return false;
    }
    contractInstance.changeTaskRequestInfo(taskName, information, {
      from: requester,
      gas: 80000000
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

/**
 * 返回任务是否完成
 * @param taskName
 * @returns {boolean}
 */
function isTaskFinished(taskName) {
  if (!taskName) return false;
  try {
    var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByTaskName.call(taskName));
    if (taskObjectInstance.isTaskStatusFinished.call()) {
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}
