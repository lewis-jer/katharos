const dataHandler = {
  arrayToObject: function (array) {
    var obj = {};
    array.map((element) => (obj[element.arrayExpression] = element));
    return obj;
  },
  createArrayByKey: (Arr, Key) => {
    let ArrItem = [];
    Arr = Arr.filter((el) => el != null && el != '');
    Arr.forEach((x, i) => (ArrItem[i] = x[Key]));
    return ArrItem;
  },
  squash: function (arr) {
    var tmp = [];
    for (var i = 0; i < arr.length; i++) if (tmp.indexOf(arr[i]) == -1) tmp.push(arr[i]);
    return tmp;
  },
  encrypter: function (message) {
    var systemConfig = this.system.getSecureContainer().system;
    var encryptMsg = CryptoJS.AES.encrypt(message, systemConfig);
    return encryptMsg.toString();
  },
  decrypter: function (encrypted) {
    var systemConfig = this.system.getSecureContainer().system;
    var decryptMsg = CryptoJS.AES.decrypt(encrypted, systemConfig);
    return decryptMsg.toString(CryptoJS.enc.Utf8);
  },
  mySQLDateCreator: (x) => new Date(x).toJSON().slice(0, 10),
  getMonthNames: () => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  findInCatArray: (Arr, Value) => {
    for (var i = 0; i < Arr.length; i++) if (Arr[i] === Value) return i;
  },
  searchArray(obj, searchKey, results = []) {
    const r = results;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (key === searchKey && typeof value !== 'object') r.push(value);
      else if (typeof value === 'object') this.searchArray(value, searchKey, r);
    });
    return r;
  },
  numberFormat: (number, decimals, dec_point, thousands_sep) => {
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
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
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
      if (typeof d !== 'number' && typeof d !== 'string') return d;
      var negative = d < 0 ? '-' : '';
      var flo = parseFloat(d);
      if (isNaN(flo)) return __htmlEscapeEntities(d);
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

      return negative + (prefix || '') + intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands) + floatPart + (postfix || '');
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
