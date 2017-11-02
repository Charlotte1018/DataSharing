angular.module("accounts", []).controller("accounts", function ($scope) {
  //账户部分初始化
  //分别取出节点所有账户、所有注册的账户、节点上已经注册的账户
  $scope.nodeAccounts = getNodeAccounts();
  $scope.registerAccounts = getRegisterAccounts();
  $scope.nodeRegisterAccounts = getNodeRegisterAccounts();

  /**
   * 页面加载完后自动显示第一个用户名
   */
  $scope.$watch('$viewContentLoaded', function () {
    //更新配置
    $scope.auth = auth;
  });
  /**
   * 更新注册账户列表
   * param  accountPassword-密码
   * return newAccountAddress-新账户地址
   */
  $scope.getRegisterAccounts = function () {
    getRegisterAccounts();
  };

  /**
   * 创建新账户
   * param  accountPassword-密码
   * return newAccountAddress-新账户地址
   */
  $scope.createAccount = function (password) {
    if (!password) {
      alert("请输入密码");
      return;
    }
    $scope.newAddress = createAccount(password);
  }

  /**
   * 获取账户余额
   * param selectedAccount-选中的账户地址
   * return balance-账户余额（单位为以太）
   */
  $scope.getBalance = function (address) {
    $scope.balance = getBalanceByAddress(address);
  }

  /**
   * 进行存储交易
   * param selectedAccountFrom-发送方地址, selectedAccountTo-交易方地址, chargeEthers-交易数额, unlockPassword-发送方密码
   * return msg-交易哈希
   */
  $scope.chargeAccount = function (from, to, password, ether, data) {
    if (!from || !to || !password || !ether) {
      alert("请填完善信息！");
      return;
    }
    if (chargeAccount(from, to, password, ether, data)) {
      alert("转账成功！");
    } else {
      alert("转账失败！");
    }
  };

  /**
   * 进行账户注册
   * param
   */
  $scope.registerAccount = function (address, password, userName) {
    if (!address || !password || !userName) {
      alert("请输入完备信息!");
      return;
    }
    //判断用户名是否合法，若存在则返回
    if (!$scope.isRegisterUserNameLegal(address, userName)) {
      alert("用户姓名不合法");
      return;
    }
    registerUser(address, password, userName);
  };

  /**
   * 判断用户名是否合法，包括是否已经存在及为空
   * @returns {boolean}
   */
  $scope.isRegisterUserNameLegal = function (address, userName) {
    if (!userName) {
      $scope.nameError = "Please input user name.";
      return false;
    }
    if (isUserAddressRegister(address)) {
      $scope.nameError = "The user address has been registered";
      return false;
    }
    if (isUserNameRegister(userName)) {
      $scope.nameError = "The user name has been registered";
      return false;
    }
    $scope.nameError = "";
    return true;
  };

  /**
   * 单击菜单后进行更新操作
   */
  $scope.clickMenu = function () {
    //获取新权限
    $scope.auth = auth;
  };
});


//账户相关通用函数
/**
 * 获取该节点账户
 * @returns {*}
 */
function getNodeAccounts() {
  var accounts = [];
  var nodeAccounts = web3.eth.accounts;
  for (var i = 0; i < nodeAccounts.length; i++) {
    var account = [];
    account.userName = getUserNameByAddress(nodeAccounts[i]);
    account.address = nodeAccounts[i];
    account.balance = getBalanceByAddress(nodeAccounts[i]);
    accounts.push(account);
  }
  return accounts;
}

/**
 * 获取节点所有已经注册的账户
 * @returns {Array}
 */
function getNodeRegisterAccounts() {
  var nodeAccounts = web3.eth.accounts;
  var accounts = [];
  //将已经注册的账户放入数组
  for (var i = 0; i < nodeAccounts.length; i++) {
    if (isUserAddressRegister(nodeAccounts[i])) {
      var account = [];
      account.userName = getUserNameByAddress(nodeAccounts[i]);
      account.address = nodeAccounts[i];
      account.balance = getBalanceByAddress(nodeAccounts[i]);
      accounts.push(account);
    }
  }
  return accounts;
}

/**
 * 获取所有已经注册的用户名称数组
 */
function getRegisterAccounts() {
  var accounts = [];
  var accountsNumber = contractInstance.getUsersNumber.call();
  for (var i = 0; i < accountsNumber; i++) {
    var account = [];
    account.userName = web3.toAscii(contractInstance.getUserNameByIndex.call(i));
    account.address = getUserAddressByName(account.userName);
    account.balance = getBalanceByAddress(account.address);
    accounts.push(account);
  }
  return accounts;
}

/**
 * 解锁账户，成功则返回true，否则返回false
 * @param accountAddress
 * @param password
 */
function unlockEtherAccount(accountAddress, password) {
  //解锁账户
  try {
    web3.personal.unlockAccount(accountAddress, password);
    return true;
  } catch (err) {
    console.log(err);
    alert("未连接到节点或者账户密码不正确");
    return false;
  }
}

/**
 * 判断地址是否合法
 * @param address
 * @returns {Boolean|*}
 */
function isAddress(address) {
  if (!address) return false;
  return web3.isAddress(address);
}

/**
 * 根据地址返回用户名
 * @param accountAddress
 * @returns {string}
 */
function getUserNameByAddress(accountAddress) {
  //判断用户是否存在
  if (!isUserAddressRegister(accountAddress)) return "UnRegister User";
  //返回用户名
  return web3.toAscii(contractInstance.getUserNameByAddress.call(accountAddress));
}

/**
 * 根据用户名返回地址
 * @param userName
 * @returns {*}
 */
function getUserAddressByName(userName) {
  return contractInstance.getUserAddressByName.call(userName);
}

/**
 * 根据用户地址返回是否已经注册
 * @param address
 * @returns {boolean}
 */
function isUserAddressRegister(address) {
  return contractInstance.isUserAddressExist.call(address);
}

/**
 * 根据用户名称返回是否已经注册
 * @param userName
 */
function isUserNameRegister(userName) {
  return contractInstance.isUserNameExist.call(userName);
}

/**
 * 根据账户地址，账户密码，用户名，进行账户注册
 * @param address
 * @param password
 * @param userName
 * @returns {boolean}
 */
function registerUser(address, password, userName) {
  //判断账户是否已经注册
  if (isUserAddressRegister(address)) {
    alert("该账户已经注册！");
    return false;
  }
  if (isUserNameRegister(userName)) {
    alert("该账户名已被使用！");
    return false;
  }
  //判断是否能够正确解锁
  if (!unlockEtherAccount(address, password)) {
    return false;
  }
  if (!isAccountHasEther(address, 1)) {
    alert("账户没有足够余额！");
    return false;
  }
  if (!isNameLengthLegal(userName, 32)) {
    alert("英文名字长度应该小于15位");
  }
  //调用合约进行注册
  try {
    contractInstance.registerUser(userName, {
      from: address,
      gas: 80000000
    });
    alert("注册成功！");
  } catch (err) {
    console.log(err);
    alert("注册失败！");
    return false;
  }
  return true;
}

/**
 * 根据地址判断是否有足够的以太币
 * @param address
 * @param ether
 * @returns {boolean}
 */
function isAccountHasEther(address, ether) {
  //判断账户是否小于0.1 ether
  if (getBalanceByAddress(address) < ether) {
    return false;
  }
  return true;
}

/**
 * 获取对应账户以太币
 * @param address
 * @returns {String|Object|*}
 */
function getBalanceByAddress(address) {
  if (!isAddress(address)) {
    alert("地址不合法！");
    return;
  }
  return web3.fromWei(web3.eth.getBalance(address), 'ether');
}

/**
 * 创建新账户
 * @param password
 * @returns {*}
 */
function createAccount(password) {
  if (!password) return null;
  try {
    web3.personal.newAccount(password);
    var newAddress = web3.eth.accounts[web3.eth.accounts.length - 1]
    alert("创建成功，账户地址为：" + newAddress);
    return newAddress;
  } catch (err) {
    console.log(err);
    alert("创建账户失败！");
    return null;
  }
}


