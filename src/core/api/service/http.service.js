const axios = require('axios');

export default axios.create({
  baseURL: 'https://services.cnsdetroit.com',
  headers: {
    'x-access-token': JSON.parse(localStorage.getItem('user'))
      ? JSON.parse(localStorage.getItem('user')).accessToken
      : false,
    'Content-type': 'application/json'
  }
});
