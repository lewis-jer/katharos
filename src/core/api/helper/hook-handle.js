import http from '../service/http.service.js';

class DataService {
  getAll() {
    return http.get('/fp-app/tx');
  }
}

const dataService = new DataService();

const submissionHandle = async (data) => {
  console.log(await dataService.getAll());
  //   await dataService('POST', endpoint, false, data).then(
  //     async ({ data: res }) => {
  //       if (res.error) {
  //         completeAction(_api)(formName, formAction, modalName);
  //         alertify.error(res.error);
  //       }
  //       data.id = res.insertId;
  //       await _api.updateTable(tableName, data, formAction, endpoint);
  //       completeAction(_api)(formName, formAction, modalName);
  //       alertify.success('Success message');
  //     }
  //   );
};

export { submissionHandle };
