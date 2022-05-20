const axios = require('axios');

var session = JSON.parse(localStorage.getItem('user'));

var headers = {
  'x-access-token': session ? session.accessToken : false,
  'Content-type': 'application/json'
};

const http = new axios.create({
  baseURL: 'https://services.cnsdetroit.com',
  headers: headers
});

class DataService {
  insertTransaction(data) {
    return http.post('/fp-app/tx', data);
  }
  updateTransaction(data) {
    return http.put('/fp-app/tx', data);
  }
  createCategory(data) {
    return http.post('/fp-app/bcat', data);
  }
  updateCategory(data) {
    return http.put('/fp-app/bcat', data);
  }
  createBudget(data) {
    return http.post('/fp-app/bx', data);
  }
  updateBudget(data) {
    return http.put('/fp-app/bx', data);
  }
  pullBudget(data) {
    return http.post('/fp-app/bx/pull', data);
  }
  deleteBudgetByMonth(data) {
    return http.delete('/fp-app/bx/month', { data: data });
  }
}

const dataService = new DataService();

const submissionHandle = async (handle, data) => {
  const response = await dataService[handle](data);
  console.log(response);
  return response;
};

export { submissionHandle };
