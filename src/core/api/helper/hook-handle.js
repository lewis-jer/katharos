var http = false;

const handle = (service, client) => {
  const dataService = new service(client);
  http = client;
  return async (handle, data) => {
    let response;
    try {
      response = await dataService[handle](data);
    } catch (e) {
      console.log(e);
      return e;
    }
    return response;
  };
};

export { handle };
