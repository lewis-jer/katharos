var http = false;

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
  deleteBudget(data) {
    return http.delete('/fp-app/bx', { data: data });
  }
}

const handle = (client) => {
  const dataService = new DataService();
  http = client;
  return async (handle, data) => {
    const response = await dataService[handle](data);
    console.log(response);
    return response;
  };
};

export { handle };
