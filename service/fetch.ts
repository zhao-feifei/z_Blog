import axios from 'axios';

const requestInstance = axios.create({
  baseUrl: '/',
});

requestInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

requestInstance.interceptors.response.use(
  (response) => {
    if (response?.status === 200) {
      return response?.data;
    } else {
      return {
        code: -1,
        message: '未知错误',
        data: null,
      };
    }
  },
  (error) => {
    Promise.reject(error);
  }
);

export default requestInstance;
