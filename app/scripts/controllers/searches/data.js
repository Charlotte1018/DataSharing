angular.module("data", [])
  .controller("data", function ($scope) {
    $scope.dataSets = getAllData();

    //获取数据
    $scope.getDatas = function () {
      $scope.dataSets = getAllData();
    };
  });

/**
 * 判断数据名称是否已存在
 * @param dataName
 * @returns {boolean}
 */
function isDataNameExist(dataName) {
  if (!dataName || !isNameLengthLegal(dataName)) {
    return false;
  }
  try {
    if (contractInstance.isDataNameExist.call(dataName)) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return true;
  }
}

/**
 * 返回所有数据
 * @returns {Array}
 */
function getAllData() {
  var dataSets = [];
  try {
    //获取数据数目
    var dataSetNum = contractInstance.getDataNum.call().toNumber();
    //逐个获取数据对象
    for (var i = 0; i < dataSetNum; i++) {
      //获取数据对象合约
      var dataObjectInstance = dataContract.at(contractInstance.getDataAddressByIndex.call(i));
      var dataSet = [];
      //获取对象详细信息
      dataSet = searchDataByName(web3.toAscii(dataObjectInstance.dataName()));
      dataSets.push(dataSet);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
  return dataSets;
}
