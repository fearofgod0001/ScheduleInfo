import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    Accept: "application/json",
    Authorization: "",
  },
});

axiosInstance.interceptors.response.use(
  (response) => ({ ...response.data }),
  (error) => {
    return Promise.reject({ ...error.response.data });
  }
);

export const callApi = async ({ url, method, data, params }) => {
  return await axiosInstance({
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    url,
    method,
    data,
    params,
  });
};

export const formApi = async ({ url, method, data, params }) => {
  return await axiosInstance({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url,
    method,
    data,
  });
};
