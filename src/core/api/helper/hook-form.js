import {
  parseFormData,
  validateFormData,
  validateSystemFields,
  validateUserFields,
  validateResponse,
  validateSearchAssist,
  validateFormDecryption,
  validateDataset
} from './hook-validation.js';
import { handle } from './hook-handle.js';

async function formSubmissionLoader(status = '') {
  if (status == '') {
    document.getElementById('formSubmitBtn').style.display = 'none';
    document.getElementById('formLoadBtn').style.display = 'block';
    document.getElementById('formLoadBtn').innerHTML = 'Loading...';
    document.getElementById('formLoadBtn').style.backgroundColor = '#8CA4EA';
    document.getElementById('formLoadBtn').style.borderColor = '#8CA4EA';
    document.getElementsByClassName('formSubmissionloader')[0].style.display = 'block';
    return true;
  } else {
    document.getElementsByClassName('formSubmissionloader')[0].style.display = 'none';
    document.getElementById('formLoadBtn').style.display = 'none';
    document.getElementById('formSubmitBtn').style.display = 'block';
  }
}

function formHelperAction(_api) {
  this.submissionHandle = false;
  this.count = 1;
  this.helper = {
    synchronizeForms: async () => {
      console.log('synchronizeForms boolean', !this.submissionHandle, _api.user.getUserCount() != this.count);
      console.log('synchronizeForms ', this.submissionHandle, _api.user.getUserCount(), this.count);
      console.log('synchronizeForms user status', _api.user.getUserStatus());
      if (!this.submissionHandle) {
        this.submissionHandle = handle(_api.system.http());
        return true;
      } else if (_api.user.getUserCount() != this.count) {
        this.submissionHandle = handle(_api.system.http());
        this.count = _api.user.getUserCount();
        return true;
      } else if (_api.user.getUserStatus()) return true;

      return false;
    },
    async completeAction(formName, formAction, modalName, params = {}) {
      let { form, response, data, tableName } = params;
      const { data: res } = response;
      data = await validateUserFields.call(_api, form, data);
      data = await validateResponse.call(_api, form, response, data);
      data = await validateSearchAssist.call(_api, form, response, data);
      data = await validateDataset.call(_api, form, data);
      data = await validateFormDecryption.call(_api, form, data);
      form.updateTable && (await _api.updateTable(tableName, data, formAction));
      _api.store.clearInputStore();
      this.cleanForm(formName, formAction);
      formSubmissionLoader(1);
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
      contents = contents.filter((el) => el.object != null && el.object != '' && el.object.includes(formAction));

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
      function removeOptions(el) {
        for (var i = el.options.length - 1; i >= 0; i--) el.remove(i);
      }

      var { formKeys, formContent } = this.formData(formName);
      this.validateForm(formName, formAction, 1);
      this.filterByValue(formKeys, formAction).forEach((x) => {
        if (formContent[x].value != '') if (formContent[x].tagName != 'SELECT') formContent[x].value = '';
        if (formContent[x].tagName == 'SELECT') removeOptions(formContent[x]);
      });
    },
    formSubmit: async (contents, formName, formAction, form, tableName) => {
      const synchronized = await this.helper.synchronizeForms();
      if (!synchronized) {
        this.helper.formClose(formName, formAction, form.modal, 'Form fail synchronize');
        return false;
      }
      var form = _api.system.getForm(form.modal);
      var data = parseFormData(contents, formAction);
      form.store && Object.assign(data, { ..._api.store.getInputStore() });
      form.version == 1 && (data = validateFormData.call(_api, form, data));
      data = validateSystemFields.call(_api, form, data);

      var frozenData = JSON.parse(JSON.stringify(data));
      if (!form.enabled) return false;
      if (form.submission == 'block') return false;
      const response = form.version == 1 && (await this.submissionHandle(form.handle, data));
      var { data: frozenResponse } = JSON.parse(JSON.stringify(response));
      typeof response.data !== 'undefined' &&
        form.version == 1 &&
        (await (async () => {
          const { data: res } = response;
          typeof res.insertId !== 'undefined' && res.insertId != 0 && (data.id = res.insertId);
          if (form.action == 'block') return false;
          await this.helper.completeAction(formName, formAction, form.modal, { form, response, data, tableName });
        })());

      form.hasOwnProperty('frozen') && form.frozen && (data = frozenData);
      form.hasOwnProperty('frozenResponse') && form.frozenResponse && (data = frozenResponse);
      return data || false;
    },
    formClose(formName, formAction, modalName, message = false) {
      _api.store.clearInputStore();
      this.cleanForm(formName, formAction);
      $(`#${modalName}`).modal('hide');
    },
    formData(formName) {
      var formKeys = [];
      var formContent = document.forms[formName].elements;
      var duplicates = [];
      for (var i in formContent) {
        if (duplicates.includes(formContent[i].name)) continue;
        if (typeof formContent[i] === 'function') continue;
        if (formContent[i].tagName == 'BUTTON') continue;
        duplicates.push(formContent[i].name);
        formKeys.push(formContent[i].name);
      }

      formKeys = formKeys.filter((el) => el != null && el != '');
      return { formKeys, formContent };
    },
    formContents(formKeys, formAction, formContents) {
      var contents = [];
      this.filterByValue(formKeys, formAction).forEach((x) => {
        let content = formContents[x];
        contents.push({ object: content.name, value: content.value || false, index: Object.values(formContents).indexOf(content) });
      });
      return contents;
    },
    async formSubmission(formName, formAction, form, tableName) {
      var { formKeys, formContent } = this.formData(formName);
      var contents = this.formContents(formKeys, formAction, formContent);
      contents = contents.filter((el) => el.object != null && el.object != '' && el.object.includes(formAction));
      if (contents.some((x) => x.value === false)) this.validateForm(formName, formAction);
      else {
        formSubmissionLoader();
        this.validateForm(formName, formAction);
        return await this.formSubmit(contents, formName, formAction, form, tableName);
      }
    },
    preloadForm(formName, formAction, modalName, content) {
      var { formKeys, formContent } = this.formData(formName);
      var contents = this.formContents(formKeys, formAction, formContent);
      var contentKeys = Object.keys(content);
      var isDate = function (date) {
        var dateValidation = new Date('02 Jan 1970 00:00:00 GMT');
        var condition1 = new Date(date) !== 'Invalid Date' && !isNaN(new Date(date)) && new Date(date) > dateValidation && date.length < 10;
        if (condition1) return date;
        return false;
      };
      contents.forEach((x) => {
        var domObj = formContent[x.object];
        var domMatch = x.object.replace(`${formAction}_`, '');
        if (!contentKeys.includes(domMatch)) return;
        if (domObj.tagName == 'INPUT') {
          var date = isDate(content[domMatch]);
          (date && (domObj.value = new Date(date).toISOString().substring(0, 10))) || (domObj.value = content[domMatch]);
        } else if (domObj.tagName == 'SELECT') {
          [domObj].forEach(({ options }) => {
            for (var i in options) {
              if (options[i].innerHTML == content[domMatch]) {
                options.selectedIndex = i;
                break;
              } else if (options[i].value == content[domMatch]) options.selectedIndex = i;
            }
          });
        }
      });
    },
    fastHandle: async (reqData, handle) => {
      const synchronized = await this.helper.synchronizeForms();
      if (!synchronized) return 'Sychronization Fail';
      var response = await this.submissionHandle(handle, reqData);
      if (response?.data?.status === 'success') return response;
      return false;
    }
  };
}

export { formHelperAction };
