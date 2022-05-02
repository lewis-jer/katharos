const axios = require('axios');

const http = axios.create({
  baseURL: 'https://services.cnsdetroit.com',
  headers: {
    'x-access-token': JSON.parse(localStorage.getItem('user'))
      ? JSON.parse(localStorage.getItem('user')).accessToken
      : false,
    'Content-type': 'application/json'
  }
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
}

const dataService = new DataService();

const submissionHandle = async (handle, data) => {
  const response = await dataService[handle](data);
  console.log(response);
  return response;
};

export { submissionHandle };
