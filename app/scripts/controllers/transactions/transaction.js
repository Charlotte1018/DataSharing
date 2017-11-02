angular.module("transactions", [])
  .controller("transactions", function ($scope) {
    $scope.transAddressTo = web3.eth.accounts[3];
    $scope.transAddressFrom = web3.eth.accounts[0];
    /**
     * 获取所有相关交易
     */
    $scope.getTrans = function (address_from, address_to) {
      $scope.tranSets = getTransactionByUser(address_from, address_to);
    };

    $scope.chargeAccount = function (from, to, password, ether, data) {
      if (!from || !to || !password || !ether || !data) {
        alert("请填完善信息！");
        return;
      }
      if (chargeAccount(from, to, password, ether, data)) {
        alert("转账成功！");
      } else {
        alert("转账失败！");
      }
    };
  });

/**
 * 根据发送者和接收者账户查询交易记录
 * @param address_from
 * @param address_to
 * @returns {*}
 */
function getTransactionByUser(address_from, address_to) {
  var result = [];
  if (!isAddress(address_from) || !isAddress(address_to)) {
    alert("请输入正确地址");
    return null;
  }
  for (var i = 1; i <= web3.eth.blockNumber; i++) {
    //获取区块所有交易
    var blockTranSets = web3.eth.getBlock(i, true);
    if (blockTranSets && blockTranSets.transactions) {
      //循环查找
      blockTranSets.transactions.forEach(function (trans) {
        if (trans.to == address_to && trans.from == address_from) {
          var tranSet = [];
          tranSet.to = address_to;
          tranSet.from = address_from;
          tranSet.amount = trans.value.toString();
          tranSet.amount = web3.fromWei(tranSet.amount, 'ether');
          tranSet.blockNum = i;
          tranSet.data = web3.toAscii(trans.input);
          result.push(tranSet);
        }
      });
    }
  }
  return result;
}

/**
 * 转账功能
 * @param from
 * @param to
 * @param password
 * @param ether
 * @param data
 * @returns {boolean}
 */
function chargeAccount(from, to, password, ether, data) {
  if (!unlockEtherAccount(from, password)) {
    return false;
  }
  try {
    web3.eth.sendTransaction({
      from: from,
      to: to,
      value: web3.toWei(ether),
      data: web3.toHex(data)
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}
