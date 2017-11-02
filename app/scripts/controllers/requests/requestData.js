angular.module("requestData", []).controller("requestData", function ($scope) {
  /**
   * 页面加载完后
   */
  $scope.$watch('$viewContentLoaded', function () {
  });

  /**
   * 请求数据
   */
  $scope.requestData = function (dataName, requester, password, requestT, information) {
    if (!dataName || !requester || !password || !requestT || !information) {
      alert("请完备信息！");
      return;
    }
    if (!isNameLengthLegal(dataName) || !isNameLengthLegal(requestT)) {
      alert("数据名和请求密码不能为空或者大于32字符！");
      return;
    }
    //解锁账户
    if (!unlockEtherAccount(requester, password)) {
      return;
    }
    if (requestData(dataName, requester, password, requestT, information)) {
      alert("请求成功！");
      return;
    }
    alert("请求失败！");
  };

  /**
   * 获取对应请求者请求数据列表
   */
  $scope.getRequestList = function (requester) {
    if (!isAddress(requester)) {
      return;
    }
    $scope.dataSet = getRequestDataList(requester);
  };

  /**
   * 更新请求备注
   */
  $scope.updateInfo = function (dataName, requester, password, information) {
    if (!dataName || !requester || !password || !information) {
      alert("请完备信息！");
      return;
    }
    if (!isNameLengthLegal(dataName)) {
      alert("数据名称长度不能超过32字符！");
      return;
    }

    if (!isDataNameExist(dataName)) {
      alert("数据名不存在！");
      return;
    }
    if (!isRequested(dataName, requester)) {
      alert("尚未请求该数据！");
      return;
    }
    if (isDataAudited(dataName, requester)) {
      alert("数据尚已被审核，不可修改！");
      return;
    }
    if (updateInformation(dataName, requester, password, information)) {
      alert("更新成功！");
      return;
    }
    alert("更新失败！");
  };
});

/**
 * 请求数据
 * @param dataName
 * @param requester
 * @param password
 * @param requestT
 * @param information
 * @returns {boolean}
 */
function requestData(dataName, requester, password, requestT, information) {
  if (!isRequestDataNameLegal(dataName, requester)) {
    return false;
  }
  try {
    //解锁账户
    if (!unlockEtherAccount(requester, password)) {
      return false;
    }
    //发送请求
    contractInstance.requestData(formatBytes(dataName), formatBytes(requestT), information, {
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
 * 返回请求的数据名称是否合法
 * @param dataName
 * @param requester
 * @returns {boolean}
 */
function isRequestDataNameLegal(dataName, requester) {
  if (!dataName || !isAddress(requester)) {
    alert("数据名称与请求者地址不能为空！");
    return false;
  }
  if (!isDataNameExist(dataName)) {
    alert("该数据不存在！");
    return false;
  }
  if (isRequested(dataName, requester)) {
    alert("该数据已经被该账户请求！");
    return false;
  }
  //判断是否与数据名称相同
  var data = searchDataByName(dataName);
  if (getUserAddressByName(data.provider) == requester) {
    alert("不能申请自己提供的数据！");
    return false;
  }
  return true;
}

/**
 * 根据请求者返回数据列表
 * @param requster
 * @returns {Array}
 */
function getRequestDataList(requester) {
  var dataSet = [];
  try {
    //获取请求数据数量
    var requestDataNum = contractInstance.getDataNumByRequester.call(requester).toNumber();
    for (var i = 0; i < requestDataNum; i++) {
      //获取数据名称
      var data = [];
      data.dataName = web3.toAscii(contractInstance.getRequestDataNameByIndex.call(requester, i));
      data = getRequestDataByName(data.dataName, requester);
      //存入数据
      dataSet.push(data);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return dataSet;
}

/**
 * 根据数据名称获取请求数据信息及状态
 * @param dataName
 * @returns {Array}
 */
function getRequestDataByName(dataName, requester) {
  var data = [];
  try {
    //获取数据基本信息
    data = searchDataByName(dataName);
    //获取对应名称的权限合约
    var accessContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(dataName));
    data.requesterName = getUserNameByAddress(requester);
    data.requester = requester;
    data.requestNumber = accessContractInstance.requesterNum();
    //获取当前状态
    data.status = accessType[accessContractInstance.accessList(accessContractInstance.requestList(requester))];
    //如果没有请求过，返回空
    if (data.status == accessType[0]) {
      return [];
    }
    //如果通过审核，设置为可以访问
    if (data.status == accessType[3]) {
      data.accessable = true;
    } else {
      data.accessable = false;
    }
    //获取当前请求备注信息
    var requestContractInstance = requestContract.at(contractInstance.getDataRequest.call(dataName, requester));
    data.information = requestContractInstance.information();
  } catch (err) {
    console.log(err);
    return [];
  }
  return data;
}

/**
 * 返回是否已经请求过该数据
 * @param dataName
 * @param requester
 * @returns {boolean}
 */
function isRequested(dataName, requester) {
  var data = getRequestDataByName(dataName, requester);
  if (data) {
    //判断是否已经审核
    return (data.status == accessType[1] || data.status == accessType[2] || data.status == accessType[3]);
  }
  return false;
}

/**
 * 返回对应数据是否已经被确认或者拒绝
 * @param dataName
 * @param requester
 * @returns {boolean}
 */
function isDataAudited(dataName, requester) {
  var data = getRequestDataByName(dataName, requester);
  if (data) {
    //判断是否已经审核
    return (data.status == accessType[2] || data.status == accessType[3]);
  }
  return false;
}

/**
 * 更新请求备注
 * @param dataName
 * @param requester
 * @param password
 * @param information
 * @returns {boolean}
 */
function updateInformation(dataName, requester, password, information) {
  if (!dataName || !requester || !password || !information || !isNameLengthLegal(dataName)) {
    return false;
  }
  if (!isDataNameExist(dataName)) {
    return false;
  }
  if (!isRequested(dataName, requester)) {
    return false;
  }
  if (isDataAudited(dataName, requester)) {
    return false;
  }

  try {
    //解锁账户
    if (!unlockEtherAccount(requester, password)) {
      return false;
    }
    contractInstance.changeDataRequestInfo(dataName, information, {
      from: requester,
      gas: 80000000
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}
