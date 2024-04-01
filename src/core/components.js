const pageObjects = (_api) => {
  return {
    objectGenerator: function (pageName, form) {
      document.getElementById('modalCanvas').innerHTML = form.modalHTML;
      document.getElementById('modal').setAttribute('name', form.modal);
      let modalTitle = document.createElement('h5');
      modalTitle.innerHTML = form.title;
      modalTitle.id = 'exampleModalLabel';
      modalTitle.classList.add('modal-title');
      document.querySelector('#modal .modal-header').prepend(modalTitle);
      _api.addEvent('createModal', { modalId: form.id, location: pageName });

      let formLoaderHTML = _api.system.getComponent('form-loader').html;
      document.getElementById('form').name = form.formId;
      document.querySelector(`form[name="${form.formId}"] .modal-body`).innerHTML += form.html;
      document.querySelector(`form[name="${form.formId}"] .modal-body`).innerHTML += formLoaderHTML;
      document.querySelector(`form[name="${form.formId}"]`).innerHTML += form.modalBtnHTML;
      _api.addEvent('createForm', { modalId: form.id, location: pageName });
    },
    objectDestructor: function (form = false, modal = false) {
      if (form) {
        document.getElementById('formCanvas').innerHTML = '';
        _api.addEvent('destroyForm', {});
      }
      if (modal) {
        document.getElementById('modalCanvas').innerHTML = '';
        _api.addEvent('destroyModal', {});
      }
    }
  };
};

export { pageObjects };
