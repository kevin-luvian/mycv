import axios from "axios";
import { store } from "../redux/Store";
import { actions } from "../redux/reducers/AuthReducer";
import Notification from "../component/notification/Notification";

const instance = axios.create({
  baseURL: "http://localhost:9000/api"
  // baseURL: process.env.CVEXPRESS_API_URL
  // baseURL: "https://mycv.atkev.site",
});

instance.interceptors.request.use(
  async (config) => {
    try {
      config.headers.Authorization = store.getState().token;
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
      Notification.show("Error: unauthorized error, JWT token discarded", Notification.type.danger);
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
}

/**
 * api result wrapper for better compatibility
 * 
 * @param {boolean} success
 * @param {string} message
 * @param {any} data
 * @returns {Promise<APIRes>} wrapped result
 */
export const Post = (path, data) =>
  instance.post(path, data)
    .then(res => {
      return new APIRes(true, res.data.message, res.data.data);
    })
    .catch(err => {
      if (err.response) return new APIRes(false, err.response.data.message);
      return new APIRes(false, "response not received");
    });

export default instance;