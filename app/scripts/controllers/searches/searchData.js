angular.module("searchData", [])
  .controller("searchData", function ($scope) {
    $scope.tool_type = getToolType();
    $scope.purpose_type = getPurposeType();
    /**
     * 根据名字搜索数据详细信息
     */
    $scope.searchDataByName = function (dataName) {
      if (!dataName) {
        alert("请输入名称！");
        return;
      }
      $scope.data = searchDataByName(dataName);
    };

    /**
     * 根据类型搜索数据
     */
    $scope.searchDataByType = function (type_key, type_value) {
      if (!type_key || !type_value) {
        alert("Please input the type key and value!");
        return;
      }
      $scope.dataSet = searchDataByType(type_key, type_value);
    };

    /**
     * 根据数据名称搜索请求列表
     * @param dataName
     */
    $scope.searchDataRequestByName = function (dataName) {
      if (!dataName) {
        alert("请输入名称！");
        return;
      }
      $scope.data = searchDataByName(dataName);
      $scope.requestList = getRequestListByDataName(dataName);
    };
  });

/**
 * 根据数据名称搜索
 * @param dataName
 * @returns {Array}
 */
function searchDataByName(dataName) {
  var data = [];
  if (!isNameLengthLegal(dataName)) {
    alert("输入数据名称不为空且不能超过32字符");
    return [];
  }
  //检查数据名称是否存在
  if (!isDataNameExist(dataName)) {
    alert("查询不到该数据信息!");
    return [];
  }
  //获取数据详细信息
  try {
    //若存在则显示详细信息
    var dataObjectInstance = dataContract.at(contractInstance.getDataAddressByDataName.call(dataName));
    //获取数据名称
    data.dataName = dataName;
    //获取对象介绍
    data.introduction = dataObjectInstance.introduction();
    //获取对象类型
    data.types = [];
    for (var j = 0; j < dataObjectInstance.typeNum().toNumber(); j++) {
      //循环添加类型
      var type = [];
      type.key = web3.toAscii(dataObjectInstance.dataTypes(j)[0]);
      type.value = web3.toAscii(dataObjectInstance.dataTypes(j)[1]);
      data.types.push(type);
    }
    data.provider = getUserNameByAddress(dataObjectInstance.provider());
  } catch (err) {
    console.log(err);
    return [];
  }
  return data;
}

/**
 * 根据数据类型查找数据集
 * @param type_key
 * @param type_value
 * @returns {Array}
 */
function searchDataByType(type_key, type_value) {
  var dataSet = [];
  if (!isNameLengthLegal(type_key) || !isNameLengthLegal(type_value)) {
    alert("输入数据类型字段不为空且不能超过32字符");
    return [];
  }
  try {
    //获取类型对象合约
    var typeAddress = contractInstance.getTypeAddressByName.call(formatBytes(type_key), formatBytes(type_value));
    var typeObjectInstance = typeContract.at(typeAddress);
    var dataNum = typeObjectInstance.dataNum().toNumber();
    if (dataNum == 0) {
      alert("Can't find the data set!");
      return [];
    }

    //循环获取数据并显示
    for (var i = 0; i < dataNum; i++) {
      //获取数据对象合约
      var dataObjectInstance = dataContract.at(typeObjectInstance.dataSets.call(i));
      var data = [];
      //获取数据名称
      data.dataName = web3.toAscii(dataObjectInstance.dataName());
      data = searchDataByName(data.dataName);
      dataSet.push(data);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return dataSet;
}
