'use strict';
//初始化web3
var Web3 = require('web3');
var nodeAddress = "http://localhost:8545";
var web3 = new Web3(Web3.providers.givenProvider || new Web3.providers.HttpProvider(nodeAddress));
//初始化
var auth = true;
/**
 * 管理合约
 * 功能：负责对数据和权限总体的控制
 * 包含直接访问变量：无
 * 包含函数如下：
 * chargeToContract() —— 向合约充值
 * chargeToUser(address userAddress, uint etherNum) —— 由合约创建者向对应用户地址转指定数额以太币，返回是否成功(bool)
 * registerUser(bytes32 userName) —— 创建用户，返回是否成功(bool)
 * isUserNameExist(bytes32 userName) —— 返回用户名是否存在(bool)
 * isUserAddressExist(bytes32 address) —— 返回用户地址是否存在(bool)
 * getUserNameByAddress(address adr) —— 根据用户地址返回用户名(bytes32)
 * getUserAddressByName(bytes32 userName) —— 根据用户名返回用户地址(address)
 * getUsersNumber() —— 返回用户数量(uint)
 * getUserNameByIndex(uint index) —— 根据下标返回用户名称
 * createData(bytes32 daNa, string intro, string cap, bytes32 cap_pwd) —— 根据用户名、介绍、权限、权限密码创建数据，返回数据对象地址(address)
 * createTask(bytes32 taNa, string intro, string cap, bytes32 cap_pwd) —— 根据用户名和介绍创建任务，返回任务对象地址(address)
 * isDataNameExist(bytes32 daNa) —— 根据数据名，返回是否存在(bool)
 * isTaskNameExist(bytes32 daNa) —— 根据任务名，返回是否存在(bool)
 * addTypeToData(bytes32 type_key, bytes32 type_value, bytes32 dataName) —— 根据类型名，类型值和数据名称，向数据中添加类型
 * addTypeToTask(bytes32 type_key, bytes32 type_value, bytes32 taskName) —— 根据类型名，类型值和任务名称，向任务中添加类型
 * getDataNum() —— 获取数据总数(uint)
 * getTaskNum() —— 获取任务总数(uint)
 * getDataAddressByIndex(uint index) —— 根据下标获取数据对象地址(address)
 * getTaskAddressByIndex(uint index) —— 根据下标获取任务对象地址(address)
 * getDataAddressByDataName(bytes32 dataName) —— 根据数据名称获取数据对象地址(address)
 * getTaskAddressByTaskName(bytes32 taskName) —— 根据任务名称获取任务对象地址(address)
 * getDataNameByIndex(uint index) —— 根据下标获取数据名称(bytes32)
 * getTaskNameByIndex(uint index) —— 根据下标获取任务名称(bytes32)
 * getTypeAddressByName(bytes32 type_key, bytes32 type_value) —— 根据类型名称获取类型地址(address)
 * isTypeExist(bytes32 type_key, bytes32 type_value) —— 判断数据类型是否存在(bool)
 * getDataAccessByName(bytes32 dataName) —— 根据数据名称获取权限对象地址(address)
 * getTaskAccessByName(bytes32 taskName) —— 根据任务名称获取权限对象地址(address)
 * getDataNumByProvider(address provider) —— 根据提供者地址返回该提供者提供的数据量(uint)
 * getTaskNumByProvider(address provider) —— 根据提供者地址返回该提供者提供的任务量(uint)
 * getProvideDataNameByIndex(address provider, uint index) —— 根据提供者地址和下标返回对应数据名称(bytes32)
 * getProvideTaskNameByIndex(address provider, uint index) —— 根据提供者地址和下标返回对应任务名称(bytes32)
 * getDataNumByRequester(address requester) —— 根据请求者地址，获取请求者请求的数据量(uint)
 * getTaskNumByRequester(address requester) —— 根据请求者地址，获取请求者请求的任务量(uint)
 * getRequestDataNameByIndex(address requester, uint index) —— 根据请求者地址和下标，获取请求的数据名称(bytes32)
 * getRequestTaskNameByIndex(address requester, uint index) —— 根据请求者地址和下标，获取请求的任务名称(bytes32)
 * requestData(bytes32 dataName, bytes32 requestT, string information) —— 根据数据名称、请求密码对数据发起请求，并携带备注信息，返回是否成功(bool)
 * requestTask(bytes32 taskName, bytes32 requestT, string information) —— 根据任务名称对任务发起请求，并携带备注信息，返回是否成功(bool)
 * rejectData(bytes32 dataName, address requester) —— 根据地址和数据名称，拒绝数据请求
 * rejectTask(bytes32 taskName, address requester) —— 根据地址和任务名称，拒绝任务请求
 * confirmData(bytes32 dataName, address requester) —— 根据地址和数据名称，确认数据请求
 * confirmTask(bytes32 taskName, address requester) —— 根据地址和任务名称，确认任务请求
 * changeDataRequestInfo(bytes32 dataName, string info) —— 修改数据请求的备注信息，返回是否成功(bool)
 * changeTaskRequestInfo(bytes32 taskName, string info) —— 修改任务请求的备注信息，返回是否成功(bool)
 * getDataRequest(bytes32 dataName, address requester) —— 根据数据名称与请求者地址，返回请求地址(address)
 * getTaskRequest(bytes32 taskName, address requester) —— 根据数据名称与请求者地址，返回请求地址(address)
 * endTask(bytes32 taskName) —— 根据任务名称结束任务，返回是否成功(bool)
 * setDataCapability(bytes32 dataName, bytes32 cap_pwd, string cap) —— 根据数据名称、权限密码和新权限字段设置权限，返回是否成功(bool)
 */

var contractAddress = "0x7D575ac9a76761256De8cb498c2eF286cDCAb409";

var abi = [{
  "constant": false,
  "inputs": [{"name": "taskName", "type": "bytes32"}, {"name": "requester", "type": "address"}],
  "name": "confirmTask",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taskName", "type": "bytes32"}, {"name": "requester", "type": "address"}],
  "name": "getTaskRequest",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "dataName", "type": "bytes32"}, {"name": "requester", "type": "address"}],
  "name": "getDataRequest",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "dataName", "type": "bytes32"}, {"name": "info", "type": "string"}],
  "name": "changeDataRequestInfo",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "adr", "type": "address"}],
  "name": "getUserNameByAddress",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "dataName", "type": "bytes32"}, {"name": "requestT", "type": "bytes32"}, {
    "name": "information",
    "type": "string"
  }],
  "name": "requestData",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taNa", "type": "bytes32"}],
  "name": "isTaskNameExist",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "provider", "type": "address"}],
  "name": "getTaskNumByProvider",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "adr", "type": "address"}],
  "name": "isUserAddressExist",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taskName", "type": "bytes32"}, {"name": "info", "type": "string"}],
  "name": "changeTaskRequestInfo",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taskName", "type": "bytes32"}],
  "name": "endTask",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "userName", "type": "bytes32"}],
  "name": "registerUser",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "type_key", "type": "bytes32"}, {"name": "type_value", "type": "bytes32"}, {
    "name": "dataName",
    "type": "bytes32"
  }],
  "name": "addTypeToData",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}, {"name": "index", "type": "uint256"}],
  "name": "getRequestDataNameByIndex",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}],
  "name": "getDataNumByRequester",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "type_key", "type": "bytes32"}, {"name": "type_value", "type": "bytes32"}],
  "name": "getTypeAddressByName",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taskName", "type": "bytes32"}],
  "name": "getTaskAddressByTaskName",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "index", "type": "uint256"}],
  "name": "getTaskNameByIndex",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "daNa", "type": "bytes32"}],
  "name": "isDataNameExist",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}, {"name": "index", "type": "uint256"}],
  "name": "getRequestTaskNameByIndex",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "index", "type": "uint256"}],
  "name": "getDataNameByIndex",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "chargeToContract",
  "outputs": [],
  "payable": true,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "dataName", "type": "bytes32"}, {"name": "requester", "type": "address"}],
  "name": "rejectData",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "userName", "type": "bytes32"}],
  "name": "isUserNameExist",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taskName", "type": "bytes32"}],
  "name": "isTaskFinished",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "index", "type": "uint256"}],
  "name": "getUserNameByIndex",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "daNa", "type": "bytes32"}, {"name": "intro", "type": "string"}, {
    "name": "cap",
    "type": "string"
  }, {"name": "cap_pwd", "type": "bytes32"}],
  "name": "createData",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "getUsersNumber",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "getDataNum",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taskName", "type": "bytes32"}],
  "name": "getTaskAccessByName",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "dataName", "type": "bytes32"}],
  "name": "getDataAddressByDataName",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "type_level1", "type": "bytes32"}, {"name": "type_level2", "type": "bytes32"}],
  "name": "isTypeExist",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "dataName", "type": "bytes32"}],
  "name": "getDataAccessByName",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}],
  "name": "getTaskNumByRequester",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "getTaskNum",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taskName", "type": "bytes32"}, {"name": "requestT", "type": "bytes32"}, {
    "name": "information",
    "type": "string"
  }],
  "name": "requestTask",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "dataName", "type": "bytes32"}, {"name": "cap_pwd", "type": "bytes32"}, {
    "name": "cap",
    "type": "string"
  }],
  "name": "setDataCapability",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "type_key", "type": "bytes32"}, {"name": "type_value", "type": "bytes32"}, {
    "name": "taskName",
    "type": "bytes32"
  }],
  "name": "addTypeToTask",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "dataName", "type": "bytes32"}, {"name": "requester", "type": "address"}],
  "name": "confirmData",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "index", "type": "uint256"}],
  "name": "getTaskAddressByIndex",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "provider", "type": "address"}, {"name": "index", "type": "uint256"}],
  "name": "getProvideDataNameByIndex",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "userAddress", "type": "address"}, {"name": "etherNum", "type": "uint256"}],
  "name": "chargeToUser",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "userName", "type": "bytes32"}],
  "name": "getUserAddressByName",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taskName", "type": "bytes32"}, {"name": "requester", "type": "address"}],
  "name": "rejectTask",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "provider", "type": "address"}],
  "name": "getDataNumByProvider",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "index", "type": "uint256"}],
  "name": "getDataAddressByIndex",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taNa", "type": "bytes32"}, {"name": "intro", "type": "string"}, {
    "name": "cap",
    "type": "string"
  }, {"name": "cap_pwd", "type": "bytes32"}],
  "name": "createTask",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "provider", "type": "address"}, {"name": "index", "type": "uint256"}],
  "name": "getProvideTaskNameByIndex",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {"inputs": [], "payable": true, "type": "constructor"}];

/**
 * 数据对象合约
 * 功能：获取数据详细信息
 * 可访问变量：
 * dataTypes[] —— 根据下标返回类型结构体json对象{bytes32 type_key,bytes32 type_value,address type_address}
 * typeNum —— 返回类型数量(uint)
 * dataName —— 数据名称(bytes32)
 * introduction —— 数据介绍(string)
 * provider —— 数据提供者地址(address)
 */
var abiDataObject = [{
  "constant": true,
  "inputs": [],
  "name": "provider",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "dataName",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "typeNum",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "", "type": "uint256"}],
  "name": "dataTypes",
  "outputs": [{"name": "type_key", "type": "bytes32"}, {
    "name": "type_value",
    "type": "bytes32"
  }, {"name": "type_address", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "t_key", "type": "bytes32"}, {"name": "t_value", "type": "bytes32"}, {
    "name": "td",
    "type": "address"
  }],
  "name": "setDataType",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "introduction",
  "outputs": [{"name": "", "type": "string"}],
  "payable": false,
  "type": "function"
}, {
  "inputs": [{"name": "daNa", "type": "bytes32"}, {"name": "intro", "type": "string"}, {
    "name": "pro",
    "type": "address"
  }, {"name": "dAuth", "type": "address"}], "payable": false, "type": "constructor"
}];
/**
 * 任务对象合约
 * 功能：获取数据详细信息
 * 可访问变量：
 * dataTypes[] —— 根据下标返回类型结构体json对象{bytes32 type_key,bytes32 type_value,address type_address}
 * typeNum —— 返回类型数量(uint)
 * dataName —— 任务名称(bytes32)
 * introduction —— 任务介绍(string)
 * provider —— 任务提供者地址(address)
 * taskStatus —— 任务状态(TaskStatus{Unfinished, Finished})
 *
 * 可访问函数：
 * isTaskStatusFinished() —— 返回任务是否完成(bool)
 */
var abiTaskObject = [{
  "constant": true,
  "inputs": [],
  "name": "provider",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "dataName",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "typeNum",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "", "type": "uint256"}],
  "name": "dataTypes",
  "outputs": [{"name": "type_key", "type": "bytes32"}, {
    "name": "type_value",
    "type": "bytes32"
  }, {"name": "type_address", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "taskStatus",
  "outputs": [{"name": "", "type": "uint8"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "t_key", "type": "bytes32"}, {"name": "t_value", "type": "bytes32"}, {
    "name": "td",
    "type": "address"
  }],
  "name": "setDataType",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "endTask",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "introduction",
  "outputs": [{"name": "", "type": "string"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "isTaskStatusFinished",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "inputs": [{"name": "daNa", "type": "bytes32"}, {"name": "intro", "type": "string"}, {
    "name": "pro",
    "type": "address"
  }, {"name": "dAuth", "type": "address"}], "payable": false, "type": "constructor"
}];

/**
 * 类型对象合约
 * 功能：记录各个类型拥有的数据地址，可提供根据类型进行快速检索
 * 可访问变量：
 * typeName —— 类型名称(bytes32)
 * dataSets[] —— 数据地址集合(address)
 * taskSets[] —— 任务地址集合(address)
 * dataNum —— 数据总数(uint)
 * taskNum —— 任务总数(uint)
 */
var abiTypeObject = [{
  "constant": true,
  "inputs": [],
  "name": "dataNum",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "", "type": "uint256"}],
  "name": "dataSets",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "taskNum",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "taskSet", "type": "address"}],
  "name": "addTaskSet",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "", "type": "uint256"}],
  "name": "taskSets",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "dataSet", "type": "address"}],
  "name": "addDataSet",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "typeName",
  "outputs": [{"name": "", "type": "bytes32"}],
  "payable": false,
  "type": "function"
}, {"inputs": [{"name": "tyNa", "type": "bytes32"}], "payable": false, "type": "constructor"}];

/**
 * 权限对象合约
 * 功能：负责记录对应数据对象的权限控制信息
 * 可访问变量：
 * accessList(address=>accessType) —— 根据请求者地址返回权限类型
 * requestList(mapping(address => address)) —— 记录请求者=>请求之间的映射关系
 * requesterList[] —— 根据下标获取请求者地址
 * requesterNum —— 返回请求者数量
 * provider —— 返回数据提供者地址
 *
 * 可调用函数：
 * getCapability(bytes32 requestT) —— 根据数据请求密码获取权限(string)
 * isRequestExist(address requester) —— 返回请求者是否请求过该数据(bool)
 * isRequestConfirm(address requester) —— 返回是否确认对应请求者的数据请求(bool)
 * isRequestReject(address requester) —— 返回是否拒绝对应请求者的数据请求(bool)
 */
var abiAccessObject = [{
  "constant": true,
  "inputs": [{"name": "", "type": "address"}],
  "name": "requestList",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "provider",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "requesterNum",
  "outputs": [{"name": "", "type": "uint256"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}],
  "name": "isRequestExist",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}],
  "name": "isRequestReject",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "", "type": "address"}],
  "name": "accessList",
  "outputs": [{"name": "", "type": "uint8"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}],
  "name": "isRequestConfirm",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}],
  "name": "confirmRequest",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requestT", "type": "bytes32"}],
  "name": "getCapability",
  "outputs": [{"name": "", "type": "string"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "cap_pwd", "type": "bytes32"}, {"name": "cap", "type": "string"}],
  "name": "setCapability",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}],
  "name": "rejectRequest",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}, {"name": "info", "type": "string"}],
  "name": "updateRequestInfo",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{"name": "requester", "type": "address"}, {"name": "requestT", "type": "bytes32"}, {
    "name": "information",
    "type": "string"
  }],
  "name": "addRequest",
  "outputs": [{"name": "", "type": "bool"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [{"name": "", "type": "uint256"}],
  "name": "requesterList",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "inputs": [{"name": "pro", "type": "address"}, {"name": "dataM", "type": "address"}, {
    "name": "cap_accessT",
    "type": "string"
  }, {"name": "cap_pwd", "type": "bytes32"}], "payable": false, "type": "constructor"
}];

/**
 * 请求对象合约
 * 功能：负责记录请求信息
 * 可访问变量：
 * requester(address) —— 请求者地址
 * information(string) —— 请求附带信息
 *
 */
var abiRequestObject = [{
  "constant": false,
  "inputs": [{"name": "info", "type": "string"}],
  "name": "updateInformation",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "requester",
  "outputs": [{"name": "", "type": "address"}],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "information",
  "outputs": [{"name": "", "type": "string"}],
  "payable": false,
  "type": "function"
}, {
  "inputs": [{"name": "req", "type": "address"}, {"name": "info", "type": "string"}],
  "payable": false,
  "type": "constructor"
}];

/**
 * 全局变量
 */
//获取管理合约
var contract = web3.eth.contract(abi);
var contractInstance = contract.at(contractAddress);
var dataContract = web3.eth.contract(abiDataObject);
var taskContract = web3.eth.contract(abiTaskObject);
var typeContract = web3.eth.contract(abiTypeObject);
var accessContract = web3.eth.contract(abiAccessObject);
var requestContract = web3.eth.contract(abiRequestObject);

//设置权限数组
var accessType = ["Init", "Pending", "Reject", "Confirm"];
//设置任务状态数组
var taskStatus = ["Unfinished", "Finished"];
//设置基本类型
var tool_type = {
  key: "Tool",
  value: [
    "802.11", "802.11 frames", "802.11a", "802.11b", "802.11g", "802.15", "802.15.4", "802.16",
    "Bluetooth", "DTN", "GPS", "MANET", "Others", "ONE", "ORBIT", "RFID", "RFMON", "SNMP", "StandardEventsReader",
    "Wi-Fi hotspot", "WiBro", "WiMax", "authentication log", "cellular network", "iMotes", "location", "packet trace",
    "sensor network", "signal strength", "syslog", "tcp dump", "vehicular network",
    "wardriving", "wireless mesh network", "wireless multihop networks"
  ]
};

var purpose_type = {
  key: "Purpose",
  value: [
    "Bit Error Characterization", "Computer Malware Investigation", "Content Distribution Evaluation",
    "Educational Use", "Energy-efficient Wireless Net", "Human Behavior Modeling", "Localization", "Location-aware Computing",
    "MAC Protocol Development", "Motion Detection", "Network Diagnosis", "Network Performance Analysis", "Network Security",
    "Network Simulation", "Others", "Opportunistic Connectivity", "Positioning Systems", "Routing Protocol",
    "Social Network Analysis", "User Mobility Characterization", "Usage Characterization"
  ]
};

angular
  .module('uiRouterApp', [
    'ui.router',
    'mainrouter',
    'directiveModule'
  ])
  .config(function ($urlRouterProvider) {
    $urlRouterProvider.when("/", "app/home");
    $urlRouterProvider.otherwise('app/home');
  })
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode({
      enabled: false, // true隐藏# false显示#
      requireBase: false
    })
  }]);
angular.module('config', [])
  .controller('config', function ($scope) {
    /**
     * 页面加载完后操作
     */
    $scope.$watch('$viewContentLoaded', function () {
      getConfig();
    });

    /**
     * 更新系统设置
     */
    $scope.updateConfig = function () {
      //如果节点地址变化，更新
      if ($scope.httpAddress && $scope.httpAddress != nodeAddress) {
        updateNodeAddress($scope.httpAddress);
        $scope.httpAddress = nodeAddress;
      }
      //如果合约地址变化，更新
      if ($scope.contractAddress && $scope.contractAddress != contractAddress) {
        updateContractAddress($scope.contractAddress);
        $scope.contractAddress = contractAddress;
      }

      //如果角色发生变化
      if ($scope.role && $scope.role != auth.toString()) {
        //如果切换为管理员
        if ($scope.role == "true") {
          switchToManager($scope.password);
        } else {
          switchToUser();
        }
      }
      getConfig();
    };

    /**
     * 读取最新配置
     */
    function getConfig() {
      //读取基本配置
      $scope.contractAddress = contractAddress;
      $scope.httpAddress = nodeAddress;
      if (false == auth) $scope.status = "User";
      else $scope.status = "Manager";
      $scope.auth = auth;
    }
  });

/**
 * 更新合约地址，重新获取管理合约对象
 * @param newContractAddress
 */
function updateContractAddress(newContractAddress) {
  //判断合约地址是否合法
  if (isAddress(newContractAddress)) {
    contractAddress = newContractAddress;
    contractInstance = contract.at(contractAddress);
  } else {
    alert("合约地址格式不正确");
  }
}

/**
 * 更新节点地址，重新获取web3对象
 * @param newNodeAddress
 */
function updateNodeAddress(newNodeAddress) {
  nodeAddress = newNodeAddress;
  web3 = new Web3(Web3.providers.givenProvider || new Web3.providers.HttpProvider(nodeAddress));
}

/**
 * 切换为管理员
 */
function switchToManager(password) {
  if (!password) {
    alert("请输入管理员密码！");
    return;
  }
  if (password == "admin") {
    auth = true;
    alert("管理员身份切换成功");
  } else {
    alert("密码错误");
  }
}

/**
 * 切换为用户
 */
function switchToUser() {
  auth = false;
  alert("用户身份切换成功");
};

/**
 * 获取工具类型数组
 * @returns {[*]}
 */
function getToolType() {
  return tool_type;
}

/**
 * 获取目的类型数组
 * @returns {[*]}
 */
function getPurposeType() {
  return purpose_type;
}

/**
 * 返回字符串长度是否合法(默认bytes32)
 * @param name
 * @param length
 * @returns {boolean}
 */
function isNameLengthLegal(name, length) {
  if (!name) return false;
  if (!length) {
    length = 66;
  }
  var nameLength = formatBytes(name).length;
  return nameLength <= length && nameLength > 0;
}
/**
 * 格式化字符串
 * @param bytes
 * @returns {*}
 */
function formatBytes(bytes) {
  //去除前后空格
  bytes = bytes.replace(/(^\s*)|(\s*$)/g, '');
  return web3.fromAscii(bytes);
}

