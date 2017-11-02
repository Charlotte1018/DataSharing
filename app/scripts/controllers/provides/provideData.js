angular.module("provideData", []).controller("provideData", function ($scope) {
  //初始化
  $scope.tool_type = getToolType();
  $scope.purpose_type = getPurposeType();
  $scope.types = [];

  /**
   * 页面加载完后
   */
  $scope.$watch('$viewContentLoaded', function () {
  });

  /**
   * 创建数据
   */
  $scope.provideData = function (address, password, dataName, introduction, capability,
                                 cap_pwd, select_tool_type, select_purpose_type) {
    if (!address || !password || !dataName || !introduction || !capability || !cap_pwd
      || !select_tool_type || !select_purpose_type) {
      alert("请填写完善信息！");
      return;
    }
    if (!isNameLengthLegal(dataName) || !isNameLengthLegal(cap_pwd) ||
      !isNameLengthLegal(select_tool_type) || !isNameLengthLegal(select_purpose_type)) {
      alert("数据名称、权限密码、类型相关字段不能超过32个字符且不为空字符串！");
      return;
    }

    if (isDataNameExist(dataName)) {
      alert("数据名称已注册!");
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
    //添加数据
    try {
      //添加数据源
      contractInstance.createData(formatBytes(dataName), introduction, capability, formatBytes(cap_pwd), {
        from: address,
        gas: 80000000
      });
      //添加数据类型
      contractInstance.addTypeToData(formatBytes($scope.tool_type.key), formatBytes(select_tool_type), formatBytes(dataName), {
        from: address,
        gas: 8000000
      });
      contractInstance.addTypeToData(formatBytes($scope.purpose_type.key), formatBytes(select_purpose_type), formatBytes(dataName), {
        from: address,
        gas: 8000000
      });
      for (i = 0; i < $scope.types.length; i++) {
        contractInstance.addTypeToData(formatBytes($scope.types[i].key), formatBytes($scope.types[i].value), formatBytes(dataName), {
          from: address,
          gas: 8000000
        });
      }
      alert("新增数据成功！");
      return true;
    } catch (err) {
      console.log(err);
      alert("新增数据失败!");
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
   * 检查数据名称是否合法
   */
  $scope.checkProvideDataNameLegal = function (dataName) {
    if (!dataName) {
      $scope.nameError = "Please input data name.";
      return;
    }
    if (isDataNameExist(dataName)) {
      $scope.nameError = "The name is exist";
      return;
    }
    if (!isNameLengthLegal(dataName)) {
      $scope.nameError = "The length of dataName should less than 32 char and not null";
      return;
    }
    $scope.nameError = "";
  };

  /**
   * 查询对应账户所提供的数据列表
   */
  $scope.getProvideData = function (provider) {
    $scope.dataSet = getProvideDataList(provider);
  };

});

/**
 * 根据提供者返回数据列表
 * @param provider
 * @returns {Array}
 */
function getProvideDataList(provider) {
  var dataSet = [];
  if (!provider || !isAddress(provider)) {
    return [];
  }
  try {
    //获取提供者提供的数据总数
    var provideNum = contractInstance.getDataNumByProvider.call(provider).toNumber();
    //逐个获取数据对象
    for (var i = 0; i < provideNum; i++) {
      var data = [];
      data.dataName = web3.toAscii(contractInstance.getProvideDataNameByIndex.call(provider, i));
      data = getProvideData(data.dataName);
      dataSet.push(data);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return dataSet;
}

/**
 * 根据数据名称获取数据
 * @param dataName
 * @returns {Array}
 */
function getProvideData(dataName) {
  var data = searchDataByName(dataName);
  try {
    //获取对应名称的权限合约
    var accessContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(dataName));
    data.requestNumber = accessContractInstance.requesterNum();
  }
  catch (err) {
    console.log(err);
    return [];
  }
  return data;
}
