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
      form.searchAssist.fields.forEach((field, index) => {
        switch (field.valueType) {
          case 'month':
            data[`searchAssist${index}`] = `${
              monthNames[new Date(data[field.index]).getMonth()]
            }`;
          case 'year':
            data[`searchAssist${index}`] = `${new Date(
              data[field.index]
            ).getFullYear()}`;
          case 'month/year':
            data[`searchAssist${index}`] = `${
              monthNames[new Date(data[field.index]).getMonth()]
            } ${new Date(data[field.index]).getFullYear()}`;
        }
      });
    console.log(data);
    return data;
  };
};

export {
  parseFormData,
  validateFormData,
  validateSystemFields,
  validateUserFields,
  validateResponse,
  validateSearchAssist
};
