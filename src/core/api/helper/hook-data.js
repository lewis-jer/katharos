const dataHandler = {
  arrayToObject: function (array) {
    var obj = {};
    array.map((element) => {
      {
        obj[element.arrayExpression] = element;
      }
    });
    return obj;
  },
  squash: function (arr) {
    var tmp = [];
    for (var i = 0; i < arr.length; i++) {
      if (tmp.indexOf(arr[i]) == -1) {
        tmp.push(arr[i]);
      }
    }
    return tmp;
  },
  FindInArray: function (Arr, Value0 = '', Value1 = '', Value2 = '') {
    for (var i = 0; i < Arr.length; i++) {
      if (
        Arr[i].category == Value0 &&
        Arr[i].month == Value1 &&
        Arr[i].year == Value2
      ) {
        return i;
      }
    }
  },
  txMatcher: function (bcat = false, bmod = false) {
    if (bcat != false) {
      for (var i in userProfile.bcatData) {
        if (userProfile.bcatData[i].bcat == bcat) {
          return userProfile.bcatData[i].Category;
        }
      }
    } else if (bmod != false) {
      for (var i in userProfile.moduleData) {
        if (userProfile.moduleData[i].SN == bmod) {
          return userProfile.moduleData[i].func;
        }
      }
    }
  },
  bcatMatcher: function (value, type) {
    if (type == 'func') {
      for (var i in userProfile.moduleData) {
        if (userProfile.moduleData[i].SN == value) {
          return userProfile.moduleData[i].func;
        }
      }
    } else if (type == 'module') {
      for (var i in userProfile.moduleData) {
        if (userProfile.moduleData[i].SN == value) {
          return userProfile.moduleData[i].bmod;
        }
      }
    } else if (type == 'type') {
      for (var i in userProfile.btypeData) {
        if (userProfile.btypeData[i].SN == value) {
          return userProfile.btypeData[i].btype;
        }
      }
    } else if (type == 'category') {
      for (var i in userProfile.bcatData) {
        if (userProfile.bcatData[i].bcat == value) {
          return userProfile.bcatData[i].Category;
        }
      }
    }
  },
  plaid: async function ($) {
    const fetchLinkToken = async () => {
      const { linkToken } = await dataService('GET', 'plaid/create-link-token');
      return linkToken;
    };

    const handler = Plaid.create({
      token: await fetchLinkToken(),
      onSuccess: async (publicToken, metadata) => {
        var plaidBtn = document.getElementById('plaid');
        const retrievedString = localStorage.getItem('user');
        const parsedObject = JSON.parse(retrievedString);
        parsedObject.plaid = true;
        const modifiedndstrigifiedForStorage = JSON.stringify(parsedObject);
        localStorage.setItem('user', modifiedndstrigifiedForStorage);
        plaidBtn.style.display = 'none';
        await dataService('POST', 'plaid/token-exchange', false, {
          publicToken: publicToken
        });
      },
      onLoad: () => {},
      onExit: (err, metadata) => {},
      onEvent: (eventName, metadata) => {},
      receivedRedirectUri: null
    });

    handler.open();
  },
  encrypter: function (message) {
    var encryptMsg = CryptoJS.AES.encrypt(
      message,
      '2c641e48-afc2-4ccd-925f-aaeedb0e8602'
    );
    encryptMsg = encryptMsg.toString();
    return encryptMsg;
  },
  decrypter: function (encrypted) {
    var decryptMsg = CryptoJS.AES.decrypt(
      encrypted,
      '2c641e48-afc2-4ccd-925f-aaeedb0e8602'
    );
    decryptMsg = decryptMsg.toString(CryptoJS.enc.Utf8);
    return decryptMsg;
  },
  txUploadDump: async function (tableName, endpoint) {
    (await dataService('GET', 'txin/dump')).data;
    userProfile.txUploadData = (await dataService('GET', 'tx/upload')).data;
    tableMiddleware().emptyTable(tableName);
  },
  stringToHash: function (string) {
    var hash = 0;
    var i;
    var char;
    if (string.length == 0) return hash;

    for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return 'eyz' + hash;
  },
  mySQLDateCreator: function (x) {
    var dt = new Date(x).toJSON().slice(0, 10);
    return dt;
  },
  updateUserProfileData: function (
    userObject,
    arrayExpression,
    action,
    endpoint,
    newObject
  ) {
    var object = userProfile[userObject];
    if (action == 'delete' && endpoint == 'bx') {
      for (var i in object) {
        if (object[i].id == arrayExpression) {
          object.splice(object.indexOf(object[i]), 1);
        }
      }
    } else if (action == 'edit' && endpoint == 'bx') {
      for (var i in object) {
        if (object[i].id == arrayExpression) {
          object[i].bxamt = newObject.bxamt;
          object[i].bcatamt = newObject.bxamt;
        }
      }
    }
  }
};

export { dataHandler };
