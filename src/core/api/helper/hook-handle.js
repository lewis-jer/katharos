import http from '../service/http.service.js';

class DataService {
  getAll() {
    return http.get('/fp-app/user');
  }
}

const dataService = new DataService();
console.log(dataService);
console.log(new DataService());

const submissionHandle = async (data) => {
  await dataService('POST', endpoint, false, data).then(
    async ({ data: res }) => {
      if (res.error) {
        completeAction(_api)(formName, formAction, modalName);
        alertify.error(res.error);
      }
      data.id = res.insertId;
      await _api.updateTable(tableName, data, formAction, endpoint);
      completeAction(_api)(formName, formAction, modalName);
      alertify.success('Success message');
    }
  );
};

export { submissionHandle };
