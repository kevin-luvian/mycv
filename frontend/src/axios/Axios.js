import axios, { AxiosRequestConfig } from "axios";
import { store } from "../redux/Store";
import { actions } from "../redux/reducers/AuthReducer";
import Notification from "../component/notification/Notification";

const instance = axios.create({
  baseURL: "https://kevinlh.herokuapp.com/api",
  // baseURL: "http://localhost:9000/api",
  // baseURL: process.env.CVEXPRESS_API_URL,
  // baseURL: "https://mycv.atkev.site",
});

instance.interceptors.request.use(
  async (config) => {
    try {
      config.headers.Authorization = store.getState().auth.token;
    } finally {
      return config;
    }
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      Notification.create(
        "Error: unauthorized error, JWT token discarded",
        Notification.type.danger
      );
      console.log("Error: unauthorized error, JWT token discarded");
      store.dispatch(actions.clear);
    }
    return Promise.reject(error);
  }
);

class APIRes {
  /**
   * @param {boolean} success
   * @param {string} message
   * @param {any} data
   */
  constructor(success, message, data, ...other) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.other = other;
  }
  notify() {
    const type = this.success
      ? Notification.type.success
      : Notification.type.danger;
    Notification.create(this.message, type);
  }
  /**
   * @param {AxiosResponse<any>} res
   * @return {APIRes} instance
   */
  static constructRes(res) {
    return new APIRes(true, res.data.message, res.data.data);
  }
  /**
   * @param {string} message
   * @return {APIRes} instance
   */
  static constructFail(message) {
    return new APIRes(false, message);
  }
}

const responseError = (err) =>
  APIRes.constructFail(err.response?.data.message || "response not received");

export const getInstance = () => instance;

export const getCancelToken = () => axios.CancelToken.source();

/**
 * axios post wrapper for better compatibility
 * @param {boolean} success
 * @param {string} message
 * @param {any} data
 * @param {AxiosRequestConfig?} config
 * @returns {Promise<APIRes>} wrapped result
 */
export const Post = (path, data, config) =>
  instance
    .post(path, data, config)
    .then((res) => APIRes.constructRes(res))
    .catch((err) => responseError(err));

export const Put = (path, data) =>
  instance
    .put(path, data)
    .then((res) => APIRes.constructRes(res))
    .catch((err) => responseError(err));

export const Get = (path) =>
  instance
    .get(path)
    .then((res) => APIRes.constructRes(res))
    .catch((err) => responseError(err));

export const Delete = (path) =>
  instance
    .delete(path)
    .then((res) => APIRes.constructRes(res))
    .catch((err) => responseError(err));

export default instance;
