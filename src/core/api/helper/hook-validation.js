const parseFormData = (contents, formAction) => {
  var data = {};
  contents.map((x, i) => {
    contents[i].object = contents[i].object.replace(`${formAction}_`, '');
    data[contents[i].object] = contents[i].value;
  });
  return data;
};

const validateFormData = (_api) => {
  console.log(this);
  return (form, data) => {
    console.log(this);
    form.hasOwnProperty('encryption') &&
      Object.entries(data).forEach((entry) => {
        const [key, value] = entry;
        form.encryption.includes(key) && (data[key] = _api.encrypter(value));
      });
    typeof data.username == 'undefined' &&
      (data.username = _api.user.getUsername());
    typeof data.SN == 'undefined' && (data.SN = uuid());
    return data;
  };
};

const validateFormDecryption = (_api) => {
  console.log(this);
  return (form, data) => {
    console.log(this);
    form.hasOwnProperty('decryption') &&
      Object.entries(data).forEach((entry) => {
        const [key, value] = entry;
        form.decryption.includes(key) && (data[key] = _api.decrypter(value));
      });
    return data;
  };
};

const validateDataset = (_api) => {
  console.log(this);
  return (form, data) => {
    console.log(this);
    form.hasOwnProperty('datasetMatcher') &&
      form.datasetMatcher.forEach((item) => {
        switch (item.target) {
          case 'tx':
            data[item.index] = _api.txMatcher(data[item.lookupIndex]);
            break;
          case 'bcat':
            data[item.index] = _api.bcatMatcher(
              data[item.lookupIndex],
              item.type
            );
            break;
          case 'date':
            switch (item.type) {
              case 'LocaleDateString':
                data[item.index] = `${new Date(
                  data[item.lookupIndex]
                ).toLocaleDateString()}`;
                break;
            }
            break;
          default:
            data[item.index] = data[item.lookupIndex];
        }
      });
    return data;
  };
};

const validateSystemFields = (_api) => {
  console.log(this);
  return (form, data) => {
    console.log(this);
    form.hasOwnProperty('systemFields') &&
      form.systemFields.forEach((field) => {
        data[field] = _api.system.createUniqueId();
      });
    return data;
  };
};

const validateUserFields = (_api) => {
  console.log(this);
  return (form, data) => {
    console.log(this);
    form.hasOwnProperty('userFields') &&
      form.userFields.forEach((item) => {
        data[item.index] = _api.user.getUserItem(item, data[item.lookupIndex]);
      });
    return data;
  };
};

const validateResponse = (_api) => {
  console.log(this);
  return (form, response, data) => {
    console.log(this);
    form.hasOwnProperty('mergeResponse') &&
      form.mergeResponse &&
      Object.assign(data, { ...response.data });
    return data;
  };
};

const validateSearchAssist = (_api) => {
  console.log(this);
  return (form, response, data) => {
    console.log(this);
    const monthNames = _api.getMonthNames();
    form.hasOwnProperty('searchAssist') &&
      form.searchAssist.enabled &&
      form.searchAssist.fields.forEach((field, index) => {
        switch (field.valueType) {
          case 'month':
            data[`searchAssist${index}`] = `${
              monthNames[new Date(data[field.index]).getMonth()]
            }`;
            break;
          case 'year':
            data[`searchAssist${index}`] = `${new Date(
              data[field.index]
            ).getFullYear()}`;
            break;
          case 'month/year':
            data[`searchAssist${index}`] = `${
              monthNames[new Date(data[field.index]).getMonth()]
            } ${new Date(data[field.index]).getFullYear()}`;
            break;
        }
      });
    return data;
  };
};

export {
  parseFormData,
  validateFormData,
  validateSystemFields,
  validateUserFields,
  validateResponse,
  validateSearchAssist,
  validateFormDecryption,
  validateDataset
};
