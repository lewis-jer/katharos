import http from '../service/http.service.js';

class DataService {
  insertTransaction(data) {
    return http.post('/fp-app/tx', data);
  }
}

const dataService = new DataService();

const submissionHandle = async (handle, data) => {
  console.log(handle);
  const response = await dataService[handle](data);
  console.log(response);
  return response;
};

export { submissionHandle };
