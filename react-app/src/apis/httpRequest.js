import axios from "axios";

// const _axios = axios.create();

export const configure = () => {
  axios.interceptors.request.use((config) => {
    return Promise.resolve(config);
    // return UserService.updateToken(cb);
  });
};

export const getAxiosClient = () => axios;

// export default {
//   getAxiosClient,
// }

const instance = axios.create({
  timeout: 20000,
});

instance.interceptors.request.use(async (config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    console.log("error", error);
    return Promise.reject(error?.response?.data || error);
  }
);

export default instance;
