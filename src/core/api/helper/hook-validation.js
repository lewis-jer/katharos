const parseFormData = (contents, formAction) => {
  var data = {};
  contents.map((x, i) => {
    contents[i].object = contents[i].object.replace(`${formAction}_`, '');
    data[contents[i].object] = contents[i].value;
  });
  return data;
};

const validateFormData = (_api) => {
  return (modalName, data) => {
    var modal = _api.system.getModal(modalName);
    var form = _api.system.getForm(modal.form);
    Object.entries(data).forEach((entry) => {
      const [key, value] = entry;
      form.encryption.includes(key) && (data[key] = _api.encrypter(value));
    });
    console.log(typeof data.SN == 'undefined');
    typeof data.username == 'undefined' && (data.username = )
    typeof data.SN == 'undefined' && (data.SN = uuid());
    return data;
  };
};

export { parseFormData, validateFormData };
