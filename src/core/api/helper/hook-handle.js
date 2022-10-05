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
  createType(data) {
    return http.post('/fp-app/btype', data);
  }
  updateType(data) {
    return http.put('/fp-app/btype', data);
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
  deleteTransaction(data) {
    return http.delete('/fp-app/tx', { data: data });
  }
  deletePendingTransaction(data) {
    return http.delete('/fp-app/tx/upload', { data: data });
  }
  deleteAllPendingTransaction(data) {
    return http.delete('/fp-app/tx/upload', { data: data });
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
