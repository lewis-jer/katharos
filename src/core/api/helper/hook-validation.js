const parseFormData = (contents, formAction) => {
  var data = {};
  contents.map((x, i) => {
    contents[i].object = contents[i].object.replace(`${formAction}_`, '');
    data[contents[i].object] = contents[i].value;
  });
  return data;
};

const validateFormData = (_api) => {
  return (form, data) => {
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
  return (form, data) => {
    Object.entries(data).forEach((entry) => {
      const [key, value] = entry;
      form.decryption.includes(key) && (data[key] = _api.decrypter(value));
    });
    return data;
  };
};

const validateDataset = (_api) => {
  return (form, data) => {
    form?.hasOwnProperty('datasetMatcher') &&
      form?.datasetMatcher.forEach((item) => {
        switch (item.target) {
          case 'tx':
            data[item.index] = _api.txMatcher(data[item.lookupIndex]);
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
        }
      });
    return data;
  };
};

const validateSystemFields = (_api) => {
  return (form, data) => {
    form?.hasOwnProperty('systemFields') &&
      form?.systemFields.forEach((field) => {
        data[field] = _api.system.createUniqueId();
      });
    return data;
  };
};

const validateUserFields = (_api) => {
  return (form, data) => {
    form?.hasOwnProperty('userFields') &&
      form?.userFields.forEach((item) => {
        data[item.index] = _api.user.getUserItem(item, data[item.lookupIndex]);
      });
    return data;
  };
};

const validateResponse = (_api) => {
  return (form, response, data) => {
    form?.hasOwnProperty('mergeResponse') &&
      form.mergeResponse &&
      Object.assign(data, { ...response.data });
    return data;
  };
};

const validateSearchAssist = (_api) => {
  return (form, response, data) => {
    const monthNames = _api.getMonthNames();
    form?.hasOwnProperty('searchAssist') &&
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
