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
    console.log(modalName);
    var modal = _api.system.getModal(modalName);
    var form = _api.system.getModal(modal.form);
    console.log(form);

    data = [data];

    data.forEach((x) => {
      data.push({
        tx: _api.encrypter(x.tx),
        txdate: x.txdate,
        txamount: x.txamount,
        txbcat: x.txbcat,
        txdesc: '',
        username: userProfile.username
      });
    });

    data.splice(0, 1);

    data = data[0];

    data.SN = typeof data.SN !== 'undefined' ? data.SN : uuid();

    console.log(data);

    modal.encryption;

    return data;
  };
};

export { parseFormData, validateFormData };
