pragma solidity ^0.4.0;

/**
 * the data object contain detail
 */
contract DataObject{
    /**
     * The type contain key, value and address
     */
    struct DataType{
        bytes32 type_key;
        bytes32 type_value;
        address type_address;
    }

    //The type detail array
    DataType[] public dataTypes;

    //The type number
    uint public typeNum;

    //The data name(unique)
    bytes32 public dataName;

    string public introduction;

    address public provider;

    //avoid attacter foges the param
    address dataAuth;

    /**
     *  init the data object
     */
    function DataObject(bytes32 daNa, string intro, address pro, address dAuth){
        dataName = daNa;
        introduction = intro;
        provider = pro;
        dataAuth = dAuth;
    }

    /**
     * set the data type
     */
    function setDataType(bytes32 t_key, bytes32 t_value, address td){
        //only the management contract can use this function
        if(msg.sender != dataAuth) return;
        //check if type exist
        for(uint i = 0; i < typeNum; i++){
            if(dataTypes[i].type_key == t_key && dataTypes[i].type_value == t_value){
                return;
            }
        }
        //if not exist, push in type array
        dataTypes.push(DataType(t_key,t_value,td));
        typeNum++;
    }
}

/**
 * The task object inherit data object
 */
contract TaskObject is DataObject{
    enum TaskStatus{Unfinished, Finished}
    //record the task status
    TaskStatus public taskStatus;
    /**
     * Create a task object
     */
    function TaskObject(bytes32 daNa, string intro, address pro, address dAuth) DataObject(daNa, intro, pro, dAuth){
        taskStatus = TaskStatus.Unfinished;
    }

    /**
     * Check the task is finished or not,
     */
    function isTaskStatusFinished() returns(bool){
        return taskStatus == TaskStatus.Finished;
    }

    /**
     * ending the task
     */
    function endTask() returns(bool){
        if(msg.sender != dataAuth) return;
        taskStatus = TaskStatus.Finished;
    }
}
/**
 * The type object storage the related dataset
 */
contract TypeObject{
    bytes32 public typeName;
    address[] public taskSets;
    address[] public dataSets;
    uint public dataNum;
    uint public taskNum;

    address creator;

    function TypeObject(bytes32 tyNa){
        typeName = tyNa;
        creator = msg.sender;
    }

    /**
     * add data set
     */
    function addDataSet(address dataSet){
        if(msg.sender != creator) return;

        //check if the address exist
        for(uint i = 0; i < dataNum; i++){
            if(dataSet == dataSets[i]){
                return;
            }
        }
        dataSets.push(dataSet);
        dataNum++;
    }

    /**
     * add task set
     */
    function addTaskSet(address taskSet){
        if(msg.sender != creator) return;

        //check if the address exist
        for(uint i = 0; i < taskNum; i++){
            if(taskSet == taskSets[i]){
                return;
            }
        }
        taskSets.push(taskSet);
        taskNum++;
    }
}

/**
 * management the types
 */
contract TypeManagement{
    address nullAddress;
    address creator;

    //Save the types of type_level1=>type_level2=>type_object
    mapping(bytes32 => mapping(bytes32 => address)) public types;

    function TypeManagement(){
        creator = msg.sender;
    }

    //add the type
    function addType(bytes32 type_level1, bytes32 type_level2){
        if(!isTypeExist(type_level1, type_level2)){
            types[type_level1][type_level2] = new TypeObject(type_level2);
        }
    }

    //if the type exist, return ture, else return false
    function isTypeExist(bytes32 type_level1, bytes32 type_level2) returns(bool){
        return types[type_level1][type_level2]!=nullAddress;
    }

    //add data to type
    function addDataToType(bytes32 type_key, bytes32 type_value, address dataAddress){
        if(msg.sender != creator) return;
        //if the type not exsit, create it
        if(!isTypeExist(type_key, type_value)){
            addType(type_key, type_value);
        }
        //get the type object
        TypeObject typeObject = (TypeObject)(types[type_key][type_value]);
        //add to type
        typeObject.addDataSet(dataAddress);
    }

     //add task to type
    function addTaskToType(bytes32 type_key, bytes32 type_value, address taskAddress){
        if(msg.sender != creator) return;
        //if the type not exsit, create it
        if(!isTypeExist(type_key, type_value)){
            addType(type_key, type_value);
        }
        //get the type object
        TypeObject typeObject = (TypeObject)(types[type_key][type_value]);
        //add to type
        typeObject.addTaskSet(taskAddress);
    }
}

/**
 * register the dataset and storage the all data/task list
 */
contract DataRegister{
    address initAddress;
    //storage the data/task name set
    mapping(bytes32 => address) public dataSets;
    mapping(bytes32 => address) public taskSets;

    //storage the data/task name set
    bytes32[] public dataNames;
    bytes32[] public taskNames;
    uint public dataNum;
    uint public taskNum;

    address creator;

    function DataRegister(){
        creator = msg.sender;
    }

    //Auth verification
    modifier checkAuth(){
        if(msg.sender != creator) return;
        _;
    }
    /**
     * register data, return the new data object address
     */
    function addData(bytes32 daNa, string intro, address provider) checkAuth() returns(address){
        //if not exist
        if(dataSets[daNa] == initAddress){
            dataSets[daNa] = new DataObject(daNa, intro, provider, msg.sender);
            dataNames.push(daNa);
            dataNum++;
            return dataSets[daNa];
        }
        return initAddress;
    }
    /**
     * register task, return the new task object address
     */
    function addTask(bytes32 taNa, string intro, address provider) checkAuth() returns(address){
        //if not exist
        if(taskSets[taNa] == initAddress){
            taskSets[taNa] = new TaskObject(taNa, intro, provider, msg.sender);
            taskNames.push(taNa);
            taskNum++;
            return taskSets[taNa];
        }
        return initAddress;
    }

    /**
     * check if the dataName is exist, if exist, return true, else return false
     */
    function isDataNameExist(bytes32 dataName) returns(bool){
        return dataSets[dataName] != initAddress;
    }

    /**
     * check if the taskName is exist, if exist, return true, else return false
     */
    function isTaskNameExist(bytes32 taskName) returns(bool){
        return taskSets[taskName] != initAddress;
    }

    /**
     * Get the data by index(start at 0)
     */
    function getDataByIndex(uint index) returns(address){
        if(index >= dataNum) return initAddress;
        return dataSets[dataNames[index]];
    }
     /**
     * Get the task by index(start at 0)
     */
    function getTaskByIndex(uint index) returns(address){
        if(index >= taskNum) return initAddress;
        return taskSets[taskNames[index]];
    }
}

/**
 * The request object
 */
contract RequestObject{
    address public requester;
    string public information;

    //recording the access object address
    address authAddress;

    modifier isAuth(){
        if(msg.sender != authAddress) return;
        _;
    }

    /**
     * Set up the object control
     */
    function RequestObject(address req, string info){
        authAddress = msg.sender;
        requester = req;
        information = info;
    }

    /**
     * Update the infomation
     */
    function updateInformation(string info) isAuth{
        information = info;
    }
}

/**
 * Record the data permission list of requester
 */
contract DataAccessObject{
    enum accessType{Init, Pending, Reject, Confirm}

    //storage the request => permission
    mapping(address => accessType) public accessList;
    //storage the requester => request object
    mapping(address => address) public requestList;
    //storage the requester => request_ticket
    mapping(address => bytes32) requestTicketList;

    address[] public requesterList;
    uint public requesterNum;
    accessType initAccessType;

    //The data provider
    address public provider;
    //Only management contract can edit
    address dataManagement;

    struct Capability{
        string accessTicket;
    }
    //the data capability
    Capability capability;
    //the capability operation password
    bytes32 capabilityPwd;

    //here should consider how to provide the token to requester and add visit timess

    function DataAccessObject(address pro, address dataM, string cap_accessT, bytes32 cap_pwd){
        provider = pro;
        dataManagement = dataM;
        capabilityPwd = cap_pwd;
        capability.accessTicket = cap_accessT;
    }

    modifier isDataManagement(){
        if(msg.sender != dataManagement) return;
        _;
    }

    /**
     * Get capability by requester
     */
    function getCapability(bytes32 requestT) returns(string){
        //if the request is confirmed and the ticket is right
        if(isRequestConfirm(msg.sender) && requestTicketList[msg.sender] == requestT){
            return capability.accessTicket;
        }
        //if the sender is
        if(msg.sender == provider && requestT == capabilityPwd){
            return capability.accessTicket;
        }
        return;
    }
    /**
     * Set capability string
     */
     function setCapability(bytes32 cap_pwd, string cap) isDataManagement{
         if(cap_pwd == capabilityPwd){
            capability.accessTicket = cap;
         }
     }
    /**
     * Check if the request in list
     */
    function isRequestExist(address requester) returns(bool){
         return accessList[requestList[requester]] != initAccessType;
     }

     /**
      * Check if the request is confirm
      */
      function isRequestConfirm(address requester) returns(bool){
          return accessList[requestList[requester]] == accessType.Confirm;
      }
      /**
      * Check if the request is reject
      */
      function isRequestReject(address requester) returns(bool){
          return accessList[requestList[requester]] == accessType.Reject;
      }

    /**
     * Add request to list
     */
    function addRequest(address requester, bytes32 requestT, string information) isDataManagement returns(bool){
        //if requester exist or the requester is the provider
        if(isRequestExist(requester)||requester==provider) return false;
        //create the request
        requestList[requester] = new RequestObject(requester, information);
        //set the statu to pending
        accessList[requestList[requester]] = accessType.Pending;
        //set the request ticket
        requestTicketList[requester] = requestT;
        //add to requester list
        requesterList.push(requester);
        requesterNum++;
        return true;
    }

    /**
     * Confirm the request
     */
    function confirmRequest(address requester) isDataManagement returns(bool){
        //if not exist, return
        if(!isRequestExist(requester)) return false;
        accessList[requestList[requester]] = accessType.Confirm;
        return true;
    }

    /**
     * Reject the request
     */
    function rejectRequest(address requester) isDataManagement returns(bool){
         //if not exist, return
        if(!isRequestExist(requester)) return false;
        accessList[requestList[requester]] = accessType.Reject;
        return true;
    }

    function updateRequestInfo(address requester, string info) isDataManagement returns(bool){
        //if not exist, return
        if(!isRequestExist(requester)) return false;
        //if the request has been confirmed or rejected, return false
        if(isRequestConfirm(requester)||isRequestReject(requester)){
            return false;
        }
        //Get the request object
        RequestObject requestObject = (RequestObject)(requestList[requester]);
        requestObject.updateInformation(info);
        return true;
    }
}


/**
 * need a util contract to impl some access key generate function, such
 * getCabilityKeyByAddress(string, address) returns(string)
 */

/**
 * Access Management Contract
 */
contract AccessManagement{
    //data
   //Storage the list of data name to access object
   mapping(bytes32 => address) public dataAccessList;
   //Storage the provider to data name list
   mapping(address => bytes32[]) public provideDataList;
   //Storage the provider to data number
   mapping(address => uint) public provideDataNum;

   //Storage the requester to data name list
   mapping(address => bytes32[]) public requestDataList;
   //Storage the requester to data number
   mapping(address => uint) public requestDataNum;

   //task
    //Storage the list of task name to access object
   mapping(bytes32 => address) public taskAccessList;
   //Storage the provider to task name list
   mapping(address => bytes32[]) public provideTaskList;
   //Storage the provider to task number
   mapping(address => uint) public provideTaskNum;

   //Storage the requester to task name list
   mapping(address => bytes32[]) public requestTaskList;
   //Storage the requester to task number
   mapping(address => uint) public requestTaskNum;
   address initAddress;

   /**
    * Return true if the data access object already exist
    */
    function isDataAccessExist(bytes32 dataName) returns(bool){
        return dataAccessList[dataName]!=initAddress;
    }

   /**
    * Return true if the task access object already exist
    */
    function isTaskAccessExist(bytes32 taskName) returns(bool){
        return taskAccessList[taskName]!=initAddress;
    }

    /**
     * Check if the data name exist in request list
     */
    function isRequestDataNameExist(address requester, bytes32 daNa) returns(bool){
        //search the list
        for(uint i = 0; i < requestDataNum[requester]; i++){
            if(requestDataList[requester][i] == daNa) return true;
        }
        return false;
    }

    /**
     * Check if the task name exist in request list
     */
    function isRequestTaskNameExist(address requester, bytes32 taNa) returns(bool){
        //search the list
        for(uint i = 0; i < requestTaskNum[requester]; i++){
            if(requestTaskList[requester][i] == taNa) return true;
        }
        return false;
    }

   /**
    * Create data access object
    */
    function createDataAccess(bytes32 dataName, address provider, string capability, bytes32 cap_pwd) returns(bool){
        if(isDataAccessExist(dataName)) return false;
        //create the data access object
        dataAccessList[dataName] = new DataAccessObject(provider, msg.sender, capability, cap_pwd);
        provideDataList[provider].push(dataName);
        provideDataNum[provider]++;
        return true;
    }

   /**
    * Create data access object
    */
    function createTaskAccess(bytes32 taskName, address provider, string capability, bytes32 cap_pwd) returns(bool){
        if(isTaskAccessExist(taskName)) return false;
        //create the task access object
        taskAccessList[taskName] = new DataAccessObject(provider, msg.sender, capability, cap_pwd);
        provideTaskList[provider].push(taskName);
        provideTaskNum[provider]++;
        return true;
    }

    /**
     * Add data name to reqeust list
     */
     function requestDataAccess(bytes32 dataName, address requester) returns(bool){
         //if the data name exist in request list
         if(isRequestDataNameExist(requester, dataName)) return false;
         requestDataList[requester].push(dataName);
         requestDataNum[requester]++;
         return true;
     }
     /**
     * Add task name to reqeust list
     */
     function requestTaskAccess(bytes32 taskName, address requester) returns(bool){
         //if the task name exist in request list
         if(isRequestTaskNameExist(requester, taskName)) return false;
         requestTaskList[requester].push(taskName);
         requestTaskNum[requester]++;
         return true;
     }
}
/**
 * Save the nickname of user address
 */
contract UserRegister{
    address initAddress;
    bytes32 initBytes32;

    //storage the relationship between address to name
    mapping(address => bytes32) public addressToName;
    mapping(bytes32 => address) public nameToAddress;
    //userName list
    bytes32[] public userNameList;
    uint public usersNumber;
    /**
     * add user to list, if success, return true, else return false
     */
    function addUser(address userAddress, bytes32 userName) returns(bool){
        //if the name and address are not set, add to the list
        if(nameToAddress[userName] == initAddress && addressToName[userAddress] == initBytes32){
            nameToAddress[userName] = userAddress;
            addressToName[userAddress] = userName;
            usersNumber++;
            userNameList.push(userName);
            return true;
        }
        return false;
    }

    /**
     * if the name has be used, return ture, else return false
     */
     function isNameExist(bytes32 name) returns(bool){
         return nameToAddress[name] != initAddress;
     }

     /**
      * if the address has be used, return ture, else return false
      */
     function isAddressExist(address adr) returns(bool){
         return addressToName[adr] != initBytes32;
     }
}

contract DataShareManagement{
    UserRegister userRegister;
    DataRegister dataRegister;
    TypeManagement typeManagement;
    AccessManagement accessManagement;
    address initAddress;

    //record the address of manager
    address managerAddress;

    function DataShareManagement() payable{
        userRegister = new UserRegister();
        dataRegister = new DataRegister();
        typeManagement = new TypeManagement();
        accessManagement = new AccessManagement();
        managerAddress = msg.sender;
    }

    //Send Ether to contract
    function chargeToContract() payable{}

    //Send Ether to User
    function chargeToUser(address userAddress, uint etherNum) returns(bool){
        //only the manager can charge
        if(msg.sender != managerAddress) return false;
        //check the etherNum is right
        if(etherNum <= 0) return false;
        //charge
        for(uint i = 0; i < etherNum; i++){
             //if the balance not enough
            if(this.balance <= 1 ether) return false;
            if(!userAddress.send(1 ether)){
                return false;
            }
        }
        return true;
    }

    //User related function
    /**
     * register user, if success, return true, else return false
     */
    function registerUser(bytes32 userName) returns(bool){
        return userRegister.addUser(msg.sender, userName);
    }
     /**
     * if the name has be used, return ture, else return false
     */
    function isUserNameExist(bytes32 userName) returns(bool){
        return userRegister.isNameExist(userName);
    }
    /**
      * if the address has be used, return ture, else return false
      */
     function isUserAddressExist(address adr) returns(bool){
         return userRegister.isAddressExist(adr);
     }

     /**
      * Get the user name by address
      */
     function getUserNameByAddress(address adr) returns(bytes32){
         return userRegister.addressToName(adr);
     }

     /**
      * Get the user address by name
      */
     function getUserAddressByName(bytes32 userName) returns(address){
         return userRegister.nameToAddress(userName);
     }

     /**
      * Get the user number
      */
      function getUsersNumber() returns(uint){
          return userRegister.usersNumber();
      }

      /**
       * Get userName by the index
       */
       function getUserNameByIndex(uint index) returns(bytes32){
           return userRegister.userNameList(index);
       }
     modifier isTheUserRegister(){
         if(!isUserAddressExist(msg.sender)) return;
         _;
     }
     //Data/task regeister relate
     /**
      * create data and return the data object address
      */
     function createData(bytes32 daNa, string intro, string cap, bytes32 cap_pwd) isTheUserRegister returns(address){
         //create data object
         address dataObject = dataRegister.addData(daNa, intro, msg.sender);
         if(dataObject == initAddress) return;
         //init the access control
         accessManagement.createDataAccess(daNa, msg.sender, cap, cap_pwd);
         //return the data address
         return dataObject;
     }
     /**
      * create task and return the task object address
      */
     function createTask(bytes32 taNa, string intro, string cap, bytes32 cap_pwd) isTheUserRegister returns(address){
         //create task object
         address taskObject = dataRegister.addTask(taNa, intro, msg.sender);
         if(taskObject == initAddress) return;
         //init the access control
         accessManagement.createTaskAccess(taNa, msg.sender, cap, cap_pwd);
         //return the task address
         return taskObject;
     }

     /**
      * check if the data name exist, if exist, return true, else return false
      */
     function isDataNameExist(bytes32 daNa) returns(bool){
         return dataRegister.isDataNameExist(daNa);
     }

     /**
      * check if the task name exist, if exist, return true, else return false
      */
     function isTaskNameExist(bytes32 taNa) returns(bool){
         return dataRegister.isTaskNameExist(taNa);
     }

     /**
      * add type to data
      */
     function addTypeToData(bytes32 type_key, bytes32 type_value, bytes32 dataName) isTheUserRegister{
          DataObject dataObject = (DataObject)(dataRegister.dataSets(dataName));
          //check if the sender is the data provider
          if(msg.sender != dataObject.provider()){
              return;
          }
          //add data to type
          typeManagement.addDataToType(type_key, type_value, dataObject);
          //add type to data
          dataObject.setDataType(type_key, type_value, typeManagement.types(type_key,type_value));
     }

     /**
      * add type to task
      */
     function addTypeToTask(bytes32 type_key, bytes32 type_value, bytes32 taskName) isTheUserRegister{
          TaskObject taskObject = (TaskObject)(dataRegister.taskSets(taskName));
          //check if the sender is the task provider
          if(msg.sender != taskObject.provider()){
              return;
          }
          //add task to type
          typeManagement.addTaskToType(type_key, type_value, taskObject);
          //add type to task
          taskObject.setDataType(type_key, type_value, typeManagement.types(type_key,type_value));
     }

     //Data/task Search relate
     /**
      * Return the number of all data
      */
      function getDataNum() returns(uint){
          return dataRegister.dataNum();
      }
     /**
      * Return the number of all task
      */
      function getTaskNum() returns(uint){
          return dataRegister.taskNum();
      }

      /**
       * Return the data object by index
       */
      function getDataAddressByIndex(uint index) returns(address){
          if(index >= getDataNum()) return;
          return dataRegister.getDataByIndex(index);
      }
      /**
       * Return the task object by index
       */
      function getTaskAddressByIndex(uint index) returns(address){
          if(index >= getTaskNum()) return;
          return dataRegister.getTaskByIndex(index);
      }

      /**
       * Get the data address by name
       */
      function getDataAddressByDataName(bytes32 dataName) returns(address){
          return dataRegister.dataSets(dataName);
      }
      /**
       * Get the task address by name
       */
      function getTaskAddressByTaskName(bytes32 taskName) returns(address){
          return dataRegister.taskSets(taskName);
      }

      /**
       * Get data name by index
       */
       function getDataNameByIndex(uint index) returns(bytes32){
           if(index >= getDataNum()) return;
           return dataRegister.dataNames(index);
       }
      /**
       * Get task name by index
       */
       function getTaskNameByIndex(uint index) returns(bytes32){
           if(index >= getTaskNum()) return;
           return dataRegister.taskNames(index);
       }

      /**
        * Get type address by type_key, type_value
        */
        function getTypeAddressByName(bytes32 type_key, bytes32 type_value)returns(address){
            return typeManagement.types(type_key, type_value);
        }

        /**
         * Return the type is exist or not
         */
         function isTypeExist(bytes32 type_level1, bytes32 type_level2)returns(bool){
             return typeManagement.isTypeExist(type_level1, type_level2);
         }

         //Access Control relate functions
         /**
          * Return the data access object
          */
          function getDataAccessByName(bytes32 dataName) returns(address){
              return accessManagement.dataAccessList(dataName);
          }
          /**
          * Return the task access object
          */
          function getTaskAccessByName(bytes32 taskName) returns(address){
              return accessManagement.taskAccessList(taskName);
          }
          /**
           * Get the provider data number by provider address
           */
          function getDataNumByProvider(address provider) returns(uint){
              return accessManagement.provideDataNum(provider);
          }
          /**
           * Get the provider task number by provider address
           */
          function getTaskNumByProvider(address provider) returns(uint){
              return accessManagement.provideTaskNum(provider);
          }

          /**
           * Get the provide data name by index
           */
          function getProvideDataNameByIndex(address provider, uint index) returns(bytes32){
              return accessManagement.provideDataList(provider,index);
          }

          /**
           * Get the provide task name by index
           */
          function getProvideTaskNameByIndex(address provider, uint index) returns(bytes32){
              return accessManagement.provideTaskList(provider,index);
          }

          /**
           * Get the request data number by provider
           */
          function getDataNumByRequester(address requester) returns(uint){
              return accessManagement.requestDataNum(requester);
          }

          /**
           * Get the request task number by provider
           */
          function getTaskNumByRequester(address requester) returns(uint){
              return accessManagement.requestTaskNum(requester);
          }

          /**
           * Get the request data name by index
           */
          function getRequestDataNameByIndex(address requester, uint index) returns(bytes32){
              return accessManagement.requestDataList(requester, index);
          }

           /**
           * Get the request task name by index
           */
          function getRequestTaskNameByIndex(address requester, uint index) returns(bytes32){
              return accessManagement.requestTaskList(requester, index);
          }
          /**
           * Check the task is finished or not
           */
           function isTaskFinished(bytes32 taskName) returns(bool){
               TaskObject taskObject = (TaskObject)(getTaskAddressByTaskName(taskName));
               return taskObject.isTaskStatusFinished();
           }
          /**
           * Request the data by name
           */
          function requestData(bytes32 dataName, bytes32 requestT, string information) isTheUserRegister returns(bool){
              if(!isDataNameExist(dataName)) return false;
              //Add to request data list
              accessManagement.requestDataAccess(dataName, msg.sender);
              DataAccessObject accessObject = (DataAccessObject)(getDataAccessByName(dataName));
              if(accessObject.addRequest(msg.sender, requestT, information)) return true;
              else return false;
          }

          /**
           * Request the task by name
           */
          function requestTask(bytes32 taskName, bytes32 requestT, string information) isTheUserRegister returns(bool){
              if(!isTaskNameExist(taskName)) return false;
              if(isTaskFinished(taskName)) return false;
              //Add to request task list
              accessManagement.requestTaskAccess(taskName, msg.sender);
              DataAccessObject accessObject = (DataAccessObject)(getTaskAccessByName(taskName));
              if(accessObject.addRequest(msg.sender, requestT, information)) return true;
              else return false;
          }

          /**
           * Reject the data by name
           */
          function rejectData(bytes32 dataName, address requester) isTheUserRegister returns(bool){
              if(!isDataNameExist(dataName)) return false;
              DataAccessObject accessObject = (DataAccessObject)(getDataAccessByName(dataName));
              //if the sender not the data provider
              if(msg.sender != accessObject.provider()) return false;
              return accessObject.rejectRequest(requester);
          }

          /**
           * Reject the task by name
           */
          function rejectTask(bytes32 taskName, address requester) isTheUserRegister returns(bool){
              if(!isTaskNameExist(taskName)) return false;
              DataAccessObject accessObject = (DataAccessObject)(getTaskAccessByName(taskName));
              //if the sender not the data provider
              if(msg.sender != accessObject.provider()) return false;
              return accessObject.rejectRequest(requester);
          }

          /**
           * Confirm the data by name
           */
          function confirmData(bytes32 dataName, address requester) isTheUserRegister returns(bool){
              if(!isDataNameExist(dataName)) return false;
              DataAccessObject accessObject = (DataAccessObject)(getDataAccessByName(dataName));
              //if the sender not the data provider
              if(msg.sender != accessObject.provider()) return false;
              return accessObject.confirmRequest(requester);
          }

          /**
           * Confirm the task by name
           */
          function confirmTask(bytes32 taskName, address requester) isTheUserRegister returns(bool){
              if(!isTaskNameExist(taskName)) return false;
              DataAccessObject accessObject = (DataAccessObject)(getTaskAccessByName(taskName));
              //if the sender not the data provider
              if(msg.sender != accessObject.provider()) return false;
              return accessObject.confirmRequest(requester);
          }

          /**
           * Change the data request information string
           */
          function changeDataRequestInfo(bytes32 dataName, string info) isTheUserRegister returns(bool){
              if(getDataRequest(dataName, msg.sender) == initAddress) return false;
              DataAccessObject accessObject = (DataAccessObject)(getDataAccessByName(dataName));
              //check if the accessObject exist and requester exist
              if(accessObject == initAddress || !accessObject.isRequestExist(msg.sender)) return false;
              //get the request object
              RequestObject requestObject = (RequestObject)(accessObject.requestList(msg.sender));
              //if the sender not the request
              if(msg.sender != requestObject.requester()) return false;
              return accessObject.updateRequestInfo(msg.sender, info);
          }
          /**
           * Change the task request information string
           */
          function changeTaskRequestInfo(bytes32 taskName, string info) isTheUserRegister returns(bool){
               if(!isTaskNameExist(taskName)) return false;
              DataAccessObject accessObject = (DataAccessObject)(getTaskAccessByName(taskName));
              //check if the accessObject exist and requester exist
              if(accessObject == initAddress || !accessObject.isRequestExist(msg.sender)) return false;
              //get the request object
              RequestObject requestObject = (RequestObject)(accessObject.requestList(msg.sender));
              //if the sender not the request
              if(msg.sender != requestObject.requester()) return false;
              return accessObject.updateRequestInfo(msg.sender, info);
          }
          /**
           * Get the request object by data name and requester
           */
           function getDataRequest(bytes32 dataName, address requester) returns(address){
               if(!isDataNameExist(dataName)) return;
               DataAccessObject accessObject = (DataAccessObject)(getDataAccessByName(dataName));
               //check if the accessObject exist
               if(accessObject == initAddress) return;
              //check if the requester exist
              if(!accessObject.isRequestExist(requester)) return;
              //get the request object
              return accessObject.requestList(requester);
           }
           /**
           * Get the request object by task name and requester
           */
           function getTaskRequest(bytes32 taskName, address requester) returns(address){
               if(!isTaskNameExist(taskName)) return;
               DataAccessObject accessObject = (DataAccessObject)(getTaskAccessByName(taskName));
               //check if the accessObject exist
               if(accessObject == initAddress) return;
              //check if the requester exist
              if(!accessObject.isRequestExist(requester)) return;
              //get the request object
              return accessObject.requestList(requester);
           }

           /**
            * End the Task by task name
            */
            function endTask(bytes32 taskName) returns(bool){
                TaskObject taskObject = (TaskObject)(getTaskAddressByTaskName(taskName));
                if(taskObject.provider() != msg.sender) return false;
                taskObject.endTask();
            }


             /**
              * Set data capability
              */
              function setDataCapability(bytes32 dataName, bytes32 cap_pwd, string cap) returns(bool){
                  DataAccessObject accessObject = (DataAccessObject)(getDataAccessByName(dataName));
                  if(accessObject.provider() != msg.sender) return false;
                  accessObject.setCapability(cap_pwd, cap);
                  return true;
              }
}
