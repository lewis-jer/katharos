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
  this.count = 1;
  this.helper = {
    synchronizeForms: async () => {
      if (!this.submissionHandle) {
        this.submissionHandle = handle(_api.system.http());
        console.log('User Forms Synchronized');
        return true;
      } else if (_api.user.getUserCount() != this.count) {
        this.submissionHandle = handle(_api.system.http());
        this.count = _api.user.getUserCount();
        console.log('New User Forms Synchronized');
        return true;
      } else if (_api.user.getUserStatus()) {
        return true;
      }

      return false;
    },
    async completeAction(formName, formAction, modalName, params = {}) {
      let { form, response, data, tableName } = params;
      const { data: res } = response;

      console.log('start completeAction: ', JSON.parse(JSON.stringify(data)));
      data = await validateUserFields.call(_api, form, data);
      data = await validateResponse.call(_api, form, response, data);
      data = await validateSearchAssist.call(_api, form, response, data);
      data = await validateDataset.call(_api, form, data);
      data = await validateFormDecryption.call(_api, form, data);

      console.log('start updateTable: ', JSON.parse(JSON.stringify(data)));
      form.updateTable && (await _api.updateTable(tableName, data, formAction, endpoint));

      _api.removeElementsById();

      this.cleanForm(formName, formAction);
      formSpinner(1);
      $(`#${modalName}`).modal('hide');

      res.status == 'success' && alertify.success('Success');
      res.status == 'fail' && alertify.error('Failure');
    },
    filterByValue(array, value) {
      return array.filter((data) => JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1);
    },
    validateForm(formName, formAction, formClose = '') {
      var { formKeys, formContent } = this.formData(formName);
      var contents = this.formContents(formKeys, formAction, formContent);

      contents = contents.filter((el) => {
        return el.object != null && el.object != '' && el.object.includes(formAction);
      });

      contents.forEach((x, index) => {
        var field = document.forms[formName].elements[x.object];
        var formField = document.getElementById(formName).getElementsByClassName('form-group')[x.index].children;
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
        if (formContent[x].value != '') if (formContent[x].tagName != 'SELECT') formContent[x].value = '';
        if (formContent[x].tagName == 'SELECT') removeOptions(formContent[x]);
      });
    },
    formSubmit: async (contents, formName, formAction, modalName, tableName) => {
      const synchronized = await this.helper.synchronizeForms();
      if (!synchronized) {
        this.helper.formClose(formName, formAction, modalName, 'Form fail synchronize');
        return;
      }
      var modal = _api.system.getModal(modalName);
      var form = _api.system.getForm(modal.form);
      var data = parseFormData(contents, formAction);
      form.store && Object.assign(data, { ..._api.store.getInputStore() });
      form.version == 1 && (data = validateFormData.call(_api, form, data));
      data = validateSystemFields.call(_api, form, data);

      console.log(`preparedData: `, JSON.parse(JSON.stringify(data)));
      if (form.enabled) {
        if (form.submission == 'block') {
          console.log('Form Submission is blocked');
          return false;
        }

        const response = form.version == 1 && (await this.submissionHandle(form.handle, data));

        console.log('Outside Scope: ', JSON.parse(JSON.stringify(this)));
        typeof response.data !== 'undefined' &&
          form.version == 1 &&
          (await (async () => {
            const { data: res } = response;
            typeof res.insertId !== 'undefined' && res.insertId != 0 && (data.id = res.insertId);
            const params = { form, response, data, tableName };
            console.log('Inside Scope: ', this);
            if (form.action == 'block') {
              console.log('Form Action is blocked');
              return false;
            }
            await this.helper.completeAction(formName, formAction, modalName, params);
          })());
      }

      return data || false;
    },
    formClose(formName, formAction, modalName, message = false) {
      _api.removeElementsById();
      this.cleanForm(formName, formAction);
      $(`#${modalName}`).modal('hide');
      if (!message) console.log('Form Closed Successfully');
      message && console.log(message);
    },
    formData(formName) {
      var formKeys = [];
      var formContent = document.forms[formName].elements;
      var duplicates = [];
      for (var i in formContent) {
        if (!duplicates.includes(formContent[i].name)) {
          if (typeof formContent[i] !== 'function') {
            if (formContent[i].tagName != 'BUTTON') {
              duplicates.push(formContent[i].name);
              formKeys.push(formContent[i].name);
            }
          }
        }
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
        contents.push({
          object: formContents[x].name,
          value: formContents[x].value || false,
          index: Object.values(formContents).indexOf(formContents[x])
        });
      });
      return contents;
    },
    async formSubmission(formName, formAction, modalName, tableName) {
      var { formKeys, formContent } = this.formData(formName);
      var contents = this.formContents(formKeys, formAction, formContent);

      contents = contents.filter((el) => {
        return el.object != null && el.object != '' && el.object.includes(formAction);
      });

      // Form Validation
      if (contents.some((x) => x.value === false)) {
        console.log('Form Missing Required Information');
        this.validateForm(formName, formAction);
      } else {
        formSpinner();
        this.validateForm(formName, formAction);
        const response = await this.formSubmit(contents, formName, formAction, modalName, tableName);
        return response;
      }
    },
    preloadForm(formName, formAction, modalName, content) {
      var { formKeys, formContent } = this.formData(formName);
      var contents = this.formContents(formKeys, formAction, formContent);
      var contentKeys = Object.keys(content);
      var isDate = function (date) {
        var dateValidation = new Date('02 Jan 1970 00:00:00 GMT');
        var condition1 =
          new Date(date) !== 'Invalid Date' && !isNaN(new Date(date)) && new Date(date) > dateValidation && date.length < 10;
        if (condition1) return date;
        return false;
      };
      contents.forEach((x) => {
        var objName = x.object;
        var domObj = formContent[objName];
        var domMatch = objName.replace(`${formAction}_`, '');
        if (contentKeys.includes(domMatch)) {
          if (domObj.tagName == 'INPUT') {
            var date = isDate(content[domMatch]);
            (date && (domObj.value = new Date(date).toISOString().substring(0, 10))) || (domObj.value = content[domMatch]);
          } else if (domObj.tagName == 'SELECT') {
            [domObj].forEach(({ options }) => {
              for (var i in options) {
                if (options[i].innerHTML == content[domMatch]) {
                  options.selectedIndex = i;
                  break;
                } else if (options[i].value == content[domMatch]) {
                  options.selectedIndex = i;
                }
              }
            });
          }
        }
      });
    },
    fastHandle: async (reqData, handle) => {
      const synchronized = await this.helper.synchronizeForms();
      if (!synchronized) {
        return 'Sychronization Fail';
      }
      var response = await this.submissionHandle(handle, reqData);
      if (response?.data?.status === 'success') return response;
      return false;
    }
  };
}

export { formHelperAction };
