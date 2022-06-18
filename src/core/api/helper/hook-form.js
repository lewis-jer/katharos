import {
  parseFormData,
  validateFormData,
  validateSystemFields,
  validateUserFields,
  validateResponse,
  validateSearchAssist,
  validateFormDecryption,
  validateDataset
} from './hook-validation';
import { handle } from './hook-handle';

function formHelperAction(_api) {
  this.submissionHandle = false;
  this.helper = {
    async completeAction(formName, formAction, modalName, params = {}) {
      let { form, response, data, tableName } = params;
      const { data: res } = response;

      data = await validateUserFields(_api)(form, data);
      data = await validateResponse(_api)(form, response, data);
      data = await validateSearchAssist(_api)(form, response, data);
      data = await validateDataset(_api)(form, data);
      data = await validateFormDecryption(_api)(form, data);

      form.updateTable &&
        (await _api.updateTable(tableName, data, formAction, endpoint));

      _api.removeElementsById();

      this.cleanForm(formName, formAction);
      formSpinner(1);
      $(`#${modalName}`).modal('hide');

      res.status == 'success' && alertify.success('Success');
      res.status == 'fail' && alertify.error('Failure');
    },
    filterByValue(array, value) {
      return array.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    },
    validateForm(formName, formAction, formClose = '') {
      var { formKeys, formContent } = this.formData(formName);
      var contents = this.formContents(formKeys, formAction, formContent);

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
    },
    cleanForm(formName, formAction) {
      function removeOptions(selectElement) {
        var i,
          L = selectElement.options.length - 1;
        for (i = L; i >= 0; i--) {
          selectElement.remove(i);
        }
      }

      var { formKeys, formContent } = this.formData(formName);
      this.validateForm(formName, formAction, 1);
      this.filterByValue(formKeys, formAction).forEach((x) => {
        if (formContent[x].value != '')
          if (formContent[x].tagName != 'SELECT') formContent[x].value = '';
        if (formContent[x].tagName == 'SELECT') removeOptions(formContent[x]);
      });
    },
    formSubmit: async (
      contents,
      formName,
      formAction,
      modalName,
      tableName
    ) => {
      !this.submissionHandle &&
        (this.submissionHandle = handle(_api.system.http()));
      console.log('formHelper: ', this);
      var modal = _api.system.getModal(modalName);
      var form = _api.system.getForm(modal.form);
      var data = parseFormData(contents, formAction);
      form.store && Object.assign(data, { ..._api.store.getInputStore() });
      form.version == 1 && (data = validateFormData(_api)(form, data));
      data = validateSystemFields(_api)(form, data);

      console.log(JSON.parse(JSON.stringify(data)));
      if (form.enabled) {
        const response =
          form.version == 1 && (await this.submissionHandle(form.handle, data));

        typeof response.data !== 'undefined' &&
          form.version == 1 &&
          (async () => {
            const { data: res } = response;
            typeof res.insertId !== 'undefined' && (data.id = res.insertId);
            const params = { form, response, data, tableName };
            await this.completeAction(formName, formAction, modalName, params);
            console.log(this);
          })();
      }
    },
    formClose(formName, formAction, modalName) {
      _api.removeElementsById();
      this.cleanForm(formName, formAction);
      $(`#${modalName}`).modal('hide');
      console.log('Form Closed Successfully');
    },
    formData(formName) {
      var formKeys = [];
      var formContent = document.forms[formName].elements;
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
    },
    formContents(formKeys, formAction, formContents) {
      var contents = [];
      this.filterByValue(formKeys, formAction).forEach((x) => {
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
    },
    formSubmission(formName, formAction, modalName, tableName) {
      var { formKeys, formContent } = this.formData(formName);
      var contents = this.formContents(formKeys, formAction, formContent);

      contents = contents.filter((el) => {
        return (
          el.object != null && el.object != '' && el.object.includes(formAction)
        );
      });

      // Form Validation
      if (contents.some((x) => x.value === false)) {
        console.log('Form Missing Required Information');
        this.validateForm(formName, formAction);
      } else {
        formSpinner();
        this.validateForm(formName, formAction);
        this.formSubmit(contents, formName, formAction, modalName, tableName);
      }
    },
    preloadForm(formName, formAction, modalName, content) {
      console.log(formName);
      var { formKeys, formContent } = this.formData(formName);
      var contents = this.formContents(formKeys, formAction, formContent);
      var dateValidation = new Date('02 Jan 1970 00:00:00 GMT');
      contents.forEach((x) => {
        if (
          Object.keys(content).includes(x.object.replace(`${formAction}_`, ''))
        ) {
          if (formContent[x.object].tagName == 'INPUT') {
            var timestamp = new Date(
              content[x.object.replace(`${formAction}_`, '')]
            );
            if (
              timestamp instanceof Date &&
              isNaN(timestamp) == false &&
              timestamp > dateValidation
            ) {
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
                } else if (
                  y.options[i].value ==
                  content[x.object.replace(`${formAction}_`, '')]
                ) {
                  y.selectedIndex = i;
                }
              }
            });
          }
        }
      });
    }
  };
}

export { formHelperAction };
