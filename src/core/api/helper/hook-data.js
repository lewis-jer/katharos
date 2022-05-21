const dataHandler = {
  arrayToObject: function (array) {
    var obj = {};
    array.map((element) => (obj[element.arrayExpression] = element));
    return obj;
  },
  squash: function (arr) {
    var tmp = [];
    for (var i = 0; i < arr.length; i++) {
      if (tmp.indexOf(arr[i]) == -1) tmp.push(arr[i]);
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
        if (userProfile.bcatData[i].bcat == bcat)
          return userProfile.bcatData[i].Category;
      }
    } else if (bmod != false) {
      for (var i in userProfile.moduleData) {
        if (userProfile.moduleData[i].SN == bmod)
          return userProfile.moduleData[i].func;
      }
    }
  },
  bcatMatcher: function (value, type) {
    if (type == 'func') {
      for (var i in userProfile.moduleData) {
        if (userProfile.moduleData[i].SN == value)
          return userProfile.moduleData[i].func;
      }
    } else if (type == 'module') {
      for (var i in userProfile.moduleData) {
        if (userProfile.moduleData[i].SN == value)
          return userProfile.moduleData[i].bmod;
      }
    } else if (type == 'type') {
      for (var i in userProfile.btypeData) {
        if (userProfile.btypeData[i].SN == value)
          return userProfile.btypeData[i].btype;
      }
    } else if (type == 'category') {
      for (var i in userProfile.bcatData) {
        if (userProfile.bcatData[i].bcat == value)
          return userProfile.bcatData[i].Category;
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
    var encryptMsg = CryptoJS.AES.encrypt(message, configuration.system);
    encryptMsg = encryptMsg.toString();
    return encryptMsg;
  },
  decrypter: function (encrypted) {
    var decryptMsg = CryptoJS.AES.decrypt(encrypted, configuration.system);
    decryptMsg = decryptMsg.toString(CryptoJS.enc.Utf8);
    return decryptMsg;
  },
  mySQLDateCreator: (x) => {
    return new Date(x).toJSON().slice(0, 10);
  },
  getMonthNames: () => {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
  },
  findInCatArray: (Arr, Value) => {
    for (var i = 0; i < Arr.length; i++) {
      if (Arr[i] === Value) {
        return i;
      }
    }
  },
  sortByValue: (Arr) => {
    return Arr.sort((a, b) => {
      return b.sum - a.sum;
    });
  },
  searchArray(obj, searchKey, results = []) {
    const r = results;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (key === searchKey && typeof value !== 'object') {
        r.push(value);
      } else if (typeof value === 'object') {
        this.searchArray(value, searchKey, r);
      }
    });
    return r;
  },
  cleanArray: (Array) => {
    return (Array = []);
  },
  numberFormat: (number, decimals, dec_point, thousands_sep) => {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
      dec = typeof dec_point === 'undefined' ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  },
  isEmpty(str) {
    return !str || str.length === 0;
  },
  integerValue(i) {
    return typeof i === 'string'
      ? i.replace(/[\$,]/g, '') * 1
      : typeof i === 'number'
      ? i
      : 0;
  },
  customNumberFormat(thousands, decimal, precision, prefix, postfix) {
    return function (d) {
      if (typeof d !== 'number' && typeof d !== 'string') {
        return d;
      }

      var negative = d < 0 ? '-' : '';
      var flo = parseFloat(d);

      // If NaN then there isn't much formatting that we can do - just
      // return immediately, escaping any HTML (this was supposed to
      // be a number after all)
      if (isNaN(flo)) {
        return __htmlEscapeEntities(d);
      }

      flo = flo.toFixed(precision);
      d = Math.abs(flo);

      var intPart = parseInt(d, 10);
      var floatPart = precision
        ? decimal +
          Number((d - intPart).toFixed(precision))
            .toString()
            .substring(2)
        : '';
      var floatValidation = [];
      for (var i = 0; i < floatPart.length; i++) {
        floatPart.charAt(i) == '.' && floatValidation.push(true);
        !isNaN(floatPart.charAt(i)) && floatValidation.push(true);
      }
      switch (floatValidation.length) {
        case 1:
          floatPart = floatPart + '00';
          console.log('Case 1');
        case 2:
          floatPart = floatPart + '0';
          console.log('Case 2');
        default:
          console.log('Float Validated');
      }
      console.log(floatPart);
      return (
        negative +
        (prefix || '') +
        intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands) +
        floatPart +
        (postfix || '')
      );
    };
  }
};

export { dataHandler };
