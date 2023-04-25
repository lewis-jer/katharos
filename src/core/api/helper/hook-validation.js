function parseFormData(contents, formAction) {
  var data = {};
  contents.map((x, i) => {
    contents[i].object = contents[i].object.replace(`${formAction}_`, '');
    data[contents[i].object] = contents[i].value;
  });
  return data;
}

function validateFormData(form, data) {
  form.hasOwnProperty('encryption') &&
    Object.entries(data).forEach(([key, value]) => form.encryption.includes(key) && (data[key] = this.encrypter(value)));
  typeof data.username == 'undefined' && (data.username = this.user.getUsername());
  typeof data.SN == 'undefined' && (data.SN = this.system.createUniqueId());
  return data;
}

function validateFormDecryption(form, data) {
  form.hasOwnProperty('decryption') &&
    Object.entries(data).forEach(([key, value]) => form.decryption.includes(key) && (data[key] = this.decrypter(value)));
  return data;
}

function validateDataset(form, data) {
  form.hasOwnProperty('datasetMatcher') &&
    form.datasetMatcher.forEach((item) => {
      switch (item.pk) {
        case 'categories':
          data[item.index] = this.user.getUserItems(item, data[item.index]).Category;
          break;
        case 'rewrite':
          data[item.rewriteIndex] = this.user.getUserItems(item, data[item.index])[item.responseIndex];
          break;
        case 'date':
          switch (item.type) {
            case 'LocaleDateString':
              data[item.index] = `${new Date(data[item.lookupIndex]).toLocaleDateString()}`;
              break;
          }
          break;
        default:
          data[item.index] = data[item.lookupIndex];
      }
    });
  return data;
}

function validateSystemFields(form, data) {
  form.hasOwnProperty('systemFields') && form.systemFields.forEach((field) => (data[field] = this.system.createUniqueId()));
  return data;
}

function validateUserFields(form, data) {
  form.hasOwnProperty('userFields') && form.userFields.forEach((item) => (data[item.index] = this.user.getUserItem(item, data[item.lookupIndex])));
  return data;
}

function validateResponse(form, response, data) {
  form.hasOwnProperty('mergeResponse') && form.mergeResponse && Object.assign(data, { ...response.data });
  return data;
}

function validateSearchAssist(form, response, data) {
  const monthNames = this.getMonthNames();
  form.hasOwnProperty('searchAssist') &&
    form.searchAssist.enabled &&
    form.searchAssist.fields.forEach((field, index) => {
      switch (field.valueType) {
        case 'month':
          data[`searchAssist${index}`] = `${monthNames[new Date(data[field.index]).getMonth()]}`;
          break;
        case 'year':
          data[`searchAssist${index}`] = `${new Date(data[field.index]).getFullYear()}`;
          break;
        case 'month/year':
          data[`searchAssist${index}`] = `${monthNames[new Date(data[field.index]).getMonth()]} ${new Date(data[field.index]).getFullYear()}`;
          break;
      }
    });
  return data;
}

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
