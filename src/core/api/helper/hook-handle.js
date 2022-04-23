import http from '../service/http.service.js';

class DataService {
  insertTransaction(data) {
    return http.post('/fp-app/tx', data);
  }
}

const dataService = new DataService();

const submissionHandle = async (handle, data) => {
  const response = await dataService[handle](data);
  console.log(response);
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
  return response;
};

export { submissionHandle };
