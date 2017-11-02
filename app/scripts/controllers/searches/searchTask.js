angular.module("searchTask", [])
  .controller("searchTask", function ($scope) {
    $scope.tool_type = getToolType();
    $scope.purpose_type = getPurposeType();
    /**
     * 根据名字搜索任务详细信息
     */
    $scope.searchTaskByName = function (taskName) {
      if (!taskName) {
        alert("请输入名称！");
        return;
      }
      $scope.task = searchTaskByName(taskName);
    };

    /**
     * 根据类型搜索任务
     */
    $scope.searchTaskByType = function (type_key, type_value) {
      if (!type_key || !type_value) {
        alert("Please input the type key and value!");
        return;
      }
      $scope.taskSets = searchTaskByType(type_key, type_value);
    };

    /**
     * 根据任务名称搜索请求列表
     * @param taskName
     */
    $scope.searchTaskRequestByName = function(taskName){
      if (!taskName) {
        alert("请输入名称！");
        return;
      }
      $scope.requestList = getRequestListByTaskName(taskName);
    };
  });

/**
 * 根据任务名称搜索
 * @param taskName
 * @returns {Array}
 */
function searchTaskByName(taskName) {
  var task = [];
  if (!isNameLengthLegal(taskName)) {
    alert("输入任务名称不为空且不能超过32字符");
    return [];
  }
  //检查任务名称是否存在
  if (!isTaskNameExist(taskName)) {
    alert("查询不到该任务信息!");
    return [];
  }
  //获取任务详细信息
  try {
    //若存在则显示详细信息
    var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByTaskName.call(taskName));
    //获取任务名称
    task.taskName = taskName;
    //获取对象介绍
    task.introduction = taskObjectInstance.introduction();
    //获取对象类型
    task.types = [];
    for (var j = 0; j < taskObjectInstance.typeNum().toNumber(); j++) {
      //循环添加类型
      var type = [];
      type.key = web3.toAscii(taskObjectInstance.dataTypes(j)[0]);
      type.value = web3.toAscii(taskObjectInstance.dataTypes(j)[1]);
      task.types.push(type);
    }
    //获取任务状态
    task.finishStatus = taskStatus[taskObjectInstance.taskStatus()];
    task.provider = getUserNameByAddress(taskObjectInstance.provider());
  } catch (err) {
    console.log(err);
    return [];
  }
  return task;
}

/**
 * 根据任务类型查找任务集
 * @param type_key
 * @param type_value
 * @returns {Array}
 */
function searchTaskByType(type_key, type_value) {
  var taskSet = [];
  if (!isNameLengthLegal(type_key) || !isNameLengthLegal(type_value)) {
    alert("输入任务类型字段不为空且不能超过32字符");
    return [];
  }
  try {
    //获取类型对象合约
    var typeAddress = contractInstance.getTypeAddressByName.call(formatBytes(type_key), formatBytes(type_value));
    var typeObjectInstance = typeContract.at(typeAddress);
    var taskNum = typeObjectInstance.taskNum().toNumber();
    if (taskNum == 0) {
      alert("Can't find the task set!");
      return [];
    }

    //循环获取任务并显示
    for (var i = 0; i < taskNum; i++) {
      //获取任务对象合约
      var taskObjectInstance = taskContract.at(typeObjectInstance.taskSets.call(i));
      var task = [];
      //获取任务名称
      task.taskName = web3.toAscii(taskObjectInstance.dataName());
      task = searchTaskByName(task.taskName);
      taskSet.push(task);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return taskSet;
}
