angular.module("task", [])
  .controller("task", function ($scope) {
    $scope.taskSets = [];

    //获取数据
    $scope.getTasks = function () {
      $scope.taskSets = getAllTask();
    };
  });


/**
 * 判断任务名称是否已存在
 * @param taskName
 * @returns {boolean}
 */
function isTaskNameExist(taskName) {
  if (!taskName || !isNameLengthLegal(taskName)) {
    return false;
  }
  try {
    if (contractInstance.isTaskNameExist.call(taskName)) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return true;
  }
}


/**
 * 返回所有任务
 * @returns {Array}
 */
function getAllTask() {
  var taskSet = [];
  try {
    //获取任务数目
    var taskSetNum = contractInstance.getTaskNum.call().toNumber();

    //逐个获取任务对象
    for (var i = 0; i < taskSetNum; i++) {
      //获取任务对象
      var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByIndex.call(i));
      var task = [];
      //获取任务详细信息
      task = searchTaskByName(web3.toAscii(taskObjectInstance.dataName()));
      taskSet.push(task);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return taskSet;
}
