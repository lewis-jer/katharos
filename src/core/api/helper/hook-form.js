import {
  parseFormData,
  validateFormData,
  validateSystemFields,
  validateUserFields
} from './hook-validation';
import { submissionHandle } from './hook-handle';
//console.log(parseFormData);

const completeAction = (_api) => {
  return async (formName, formAction, modalName, params = {}) => {
    let { form, response, data, tableName } = params;
    if (!form) {
      _api.removeElementsById(null, null, formAction, modalName);
      cleanForm(formName, formAction);
      formSpinner(1);
      $(`#${modalName}`).modal('hide');
      console.log('Form Submitted Successfully');
    } else {
      const { data: res } = response;

      data = await validateUserFields(form, data);
      console.log(form, response, data, tableName);
      form.updateTable &&
        (await _api.updateTable(_api)(tableName, data, formAction, endpoint));

      _api.removeElementsById(null, null, formAction, modalName);

      cleanForm(formName, formAction);
      formSpinner(1);
      $(`#${modalName}`).modal('hide');

      res.status == 'success' && alertify.success('Success');
      res.status == 'fail' && alertify.error('Failure');
    }
  };
};

const formValidation = (formName, formAction, contents) => {
  validateForm(formName, formAction);
};

const filterByValue = (array, value) => {
  return array.filter(
    (data) =>
      JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
  );
};

const validateForm = (formName, formAction, formClose = '') => {
  var { formKeys, formContent } = formData(formName);
  var contents = formContents(formKeys, formAction, formContent);

  contents = contents.filter((el) => {
    return (
      el.object != null && el.object != '' && el.object.includes(formAction)
    );
  });

  contents.forEach((x, index) => {
    var field = document.forms[formName].elements[x.object];
    var formField = document
      .getElementById(formName)
      .getElementsByClassName('form-group')[x.index].children;
    if (formClose == '') {
      for (var i in formField) {
        if (formField[i].tagName == 'SPAN' && x.value === false) {
          formField[i].id = `error${Date.now()}`;
          const Error = document.getElementById(formField[i].id);
          Error.classList.add('visible');
          Error.setAttribute('aria-hidden', false);
          Error.setAttribute('aria-invalid', true);
          Error.style.display = 'block';
          field.style.borderColor = 'red';
          formField[i].id = `error`;
        } else if (formField[i].tagName == 'SPAN' && x.value) {
          formField[i].id = `error${Date.now()}`;
          const Error = document.getElementById(formField[i].id);
          Error.classList.add('hidden');
          Error.setAttribute('aria-hidden', true);
          Error.setAttribute('aria-invalid', false);
          Error.style.display = 'none';
          field.style.borderColor = '#d1d3e2';
          formField[i].id = `error`;
        }
      }
    } else if (formClose == 1) {
      for (var i in formField) {
        if (formField[i].tagName == 'SPAN') {
          formField[i].id = `error${Date.now()}`;
          const Error = document.getElementById(formField[i].id);
          Error.classList.add('hidden');
          Error.setAttribute('aria-hidden', true);
          Error.setAttribute('aria-invalid', false);
          Error.style.display = 'none';
          field.style.borderColor = '#d1d3e2';
          formField[i].id = `error`;
        }
      }
    }
  });
};

const cleanForm = (formName, formAction) => {
  function removeOptions(selectElement) {
    var i,
      L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
      selectElement.remove(i);
    }
  }

  var { formKeys, formContent } = formData(formName);
  validateForm(formName, formAction, 1);
  filterByValue(formKeys, formAction).forEach((x) => {
    if (formContent[x].value != '')
      if (formContent[x].tagName != 'SELECT') formContent[x].value = '';
    if (formContent[x].tagName == 'SELECT') removeOptions(formContent[x]);
  });
};

const formSubmit = (_api) => {
  return async (contents, formName, formAction, modalName, tableName) => {
    var modal = _api.system.getModal(modalName);
    var form = _api.system.getForm(modal.form);
    var endpoint = modalName.replace(`${formAction}`, '');
    var data = parseFormData(contents, formAction);
    form.store && Object.assign(data, { ..._api.store.getInputStore() });
    form.version == 1 && (data = validateFormData(_api)(form, data));
    data = validateSystemFields(_api)(form, data);

    console.log('----------------------');
    console.log(data);
    console.log('----------------------');
    if (form.enabled) {
      const response =
        form.version == 1 && (await submissionHandle(form.handle, data));

      typeof response.data !== 'undefined' &&
        form.version == 1 &&
        (async () => {
          const { data: res } = response;
          typeof res.insertId !== 'undefined' && (data.id = res.insertId);
          const params = { form, response, data, tableName };
          await completeAction(_api)(formName, formAction, modalName, params);
        })();
    }

    let res;

    if (formAction == 'add') {
      if (endpoint == 'bx') {
        // data.date = data.mth + data.yr;
        // data.func = document.getElementById('func').innerHTML;
        // data.dates = _api.mySQLDateCreator(`${data.mth} 1 ${data.yr}`);
        // data.username = userProfile.username;
        // console.log(data);
        // await dataService('POST', endpoint, false, data).then(
        //   async ({ data: res }) => {
        //     var error = false;
        //     for (var i in res) {
        //       if (Object.keys(res[i]).includes('errno')) {
        //         error = true;
        //       }
        //     }
        //     if (error) {
        //       await completeAction(_api)(formName, formAction, modalName);
        //       alertify.error('Request Failed');
        //     } else {
        //       //data.id = res[0].insertId
        //       data = res[1];
        //       userProfile.bxExpData.push(data);
        //       userProfile.bxIncData.push(data);
        //       await _api.updateTable(tableName, data, formAction, endpoint);
        //       await completeAction(_api)(formName, formAction, modalName);
        //       alertify.success('Success message');
        //     }
        //   }
        // );
      }
    } else if (formAction == 'edit') {
      if (endpoint == 'bx') {
        data.ui = document.getElementById('el3').innerHTML;
        data.id = document.getElementById('el1').innerHTML;
        data.bxamt = parseFloat(data.bxamt);
        await dataService('PUT', endpoint, data.id, data).then(
          async ({ data: res }) => {
            var error = false;
            for (var i in res) {
              if (Object.keys(res[i]).includes('errno')) {
                error = true;
              }
            }
            if (error) {
              await completeAction(_api)(formName, formAction, modalName);
              alertify.error('Request Failed');
            } else {
              data = res[1];
              await _api.updateTable(tableName, data, formAction, endpoint);
              await completeAction(_api)(formName, formAction, modalName);
              alertify.success('Success message');
            }
          }
        );
      }
    }
  };
};

const formClose = (_api) => {
  return (formName, formAction, modalName) => {
    _api.removeElementsById(null, null, formAction, modalName);
    cleanForm(formName, formAction);
    $(`#${modalName}`).modal('hide');
    console.log('Form Closed Successfully');
  };
};

const formData = (formName) => {
  var formKeys = [];
  var /* formKeys = Object.keys(document.forms[formName].elements), */ formContent =
      document.forms[formName].elements;
  for (var i in formContent) {
    formKeys.push(formContent[i].name);
  }

  formKeys = formKeys.filter((el) => {
    return el != null && el != '';
  });
  return {
    formKeys,
    formContent
  };
};

const formContents = (formKeys, formAction, formContents) => {
  var contents = [];
  filterByValue(formKeys, formAction).forEach((x) => {
    if (
      formContents[x].value != '' &&
      formContents[x].value &&
      formContents[x].value != 'null'
    ) {
      if (formContents[x].tagName != 'BUTTON')
        contents.push({
          object: formContents[x].name,
          value: formContents[x].value,
          index: Object.values(formContents).indexOf(formContents[x])
        });
    } else {
      if (formContents[x].tagName != 'BUTTON')
        contents.push({
          object: formContents[x].name,
          value: false,
          index: Object.values(formContents).indexOf(formContents[x])
        });
    }
  });
  return contents;
};

const formSubmission = (_api) => {
  return (formName, formAction, modalName, tableName) => {
    var { formKeys, formContent } = formData(formName);
    var contents = formContents(formKeys, formAction, formContent);

    contents = contents.filter((el) => {
      return (
        el.object != null && el.object != '' && el.object.includes(formAction)
      );
    });

    // formValidation
    if (contents.some((x) => x.value === false)) {
      console.log('Form Missing Required Information');
      formValidation(formName, formAction, contents);
    } else {
      formSpinner();
      formValidation(formName, formAction, contents);
      formSubmit(_api)(contents, formName, formAction, modalName, tableName);
    }
  };
};

const preloadForm = (formName, formAction, modalName, content) => {
  var { formKeys, formContent } = formData(formName);
  var contents = formContents(formKeys, formAction, formContent);
  contents.forEach((x) => {
    if (Object.keys(content).includes(x.object.replace(`${formAction}_`, ''))) {
      if (formContent[x.object].tagName == 'INPUT') {
        var timestamp = Date.parse(
          content[x.object.replace(`${formAction}_`, '')]
        );
        if (!x.object.includes('amount') && isNaN(timestamp) == false) {
          var d = new Date(timestamp).toISOString().substring(0, 10);
          formContent[x.object].value = d;
        } else {
          formContent[x.object].value =
            content[x.object.replace(`${formAction}_`, '')];
        }
      } else if (formContent[x.object].tagName == 'SELECT') {
        [formContent[x.object]].forEach((y, j) => {
          for (var i in y.options) {
            if (
              y.options[i].innerHTML ==
              content[x.object.replace(`${formAction}_`, '')]
            ) {
              y.selectedIndex = i;
              break;
            }
          }
        });
      }
    }
  });
};

const formMiddleware = (_api) => {
  return {
    completeAction: completeAction(_api),
    formValidation: formValidation,
    filterByValue: filterByValue,
    validateForm: validateForm,
    cleanForm: cleanForm,
    formClose: formClose(_api),
    formData: formData,
    formContents: formContents,
    formSubmission: formSubmission(_api),
    preloadForm: preloadForm
  };
};

export { formMiddleware };
