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
    console.log(data);
    return data;
  };
};

export {
  parseFormData,
  validateFormData,
  validateSystemFields,
  validateUserFields
};
