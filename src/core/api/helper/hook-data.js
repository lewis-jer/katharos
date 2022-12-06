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
  plaid: async function ($) {
    const fetchLinkToken = async () => {
      const {
        data: { linkToken }
      } = await this.system.http().get('fp-app/plaid/create-link-token/' + this.user.getUsername());
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
        await this.system.http().post('fp-app/plaid/token-exchange/' + this.user.getUsername(), {
          publicToken: publicToken
        });
      },
      onLoad: () => {},
      onExit: async (err, metadata) => {},
      onEvent: (eventName, metadata) => {},
      receivedRedirectUri: null
    });

    handler.open();
  },
  plaidLoginRequired: async function ($) {
    const fetchLinkToken = async () => {
      const {
        data: { linkToken }
      } = await this.system.http().post('fp-app/plaid/update-link-token/', {
        username: this.user.getUsername()
      });
      return linkToken;
    };

    const handler = Plaid.create({
      token: await fetchLinkToken(),
      onSuccess: async (publicToken, metadata) => {
        const response = await this.system.http().post('fp-app/plaid/alerts/clear', {
          username: this.user.getUsername()
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
    var systemConfig = this.system.getSecureContainer().system;
    var encryptMsg = CryptoJS.AES.encrypt(message, systemConfig);
    encryptMsg = encryptMsg.toString();
    return encryptMsg;
  },
  decrypter: function (encrypted) {
    var systemConfig = this.system.getSecureContainer().system;
    var decryptMsg = CryptoJS.AES.decrypt(encrypted, systemConfig);
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
    return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
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
          break;
        case 2:
          floatPart = floatPart + '0';
          break;
      }

      return (
        negative +
        (prefix || '') +
        intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands) +
        floatPart +
        (postfix || '')
      );
    };
  },
  calculate(originalValue, newValue, operator) {
    var data;
    switch (operator) {
      case '+':
        return originalValue + newValue;
      case '-':
        return originalValue - newValue;
      case '/':
        return originalValue / newValue;
      case '*':
        return originalValue * newValue;
    }
    return data;
  }
};

export { dataHandler };
