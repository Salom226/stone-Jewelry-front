import axios from "axios";
import { useUserStore } from "@/store/user.store";

const userStore = useUserStore();

export class Api {
  constructor() {
    this.userStore = useUserStore();
    this.baseUrl = "http://localhost:8000/api";
  }

  get(url, options = {}) {
    const newOptions = this._addAuthorizationHeader(options);
    return axios.get(this.baseUrl + url, newOptions);
  }

  post(url, data, options = {}) {
    const newOptions = this._addAuthorizationHeader(options);
    return axios.post(this.baseUrl + url, data, newOptions);
  }

  patch(url, data, options = {}) {
    const newOptions = this._addAuthorizationHeader(options);
    return axios.patch(this.baseUrl + url, data, newOptions);
  }

  put(url, data, options = {}) {
    const newOptions = this._addAuthorizationHeader(options);
    return axios.put(this.baseUrl + url, data, newOptions);
  }

  delete(url, options = {}) {
    const newOptions = this._addAuthorizationHeader(options);
    return axios.delete(this.baseUrl + url, newOptions);
  }

  _addAuthorizationHeader(options) {
    const user = userStore.getUser();
    if (user.token) {
      if (options.headers) {
        options.headers.Authorization = `Bearer ${user.token}`;
      } else {
        options.headers = {};
        options.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return options;
  }
}
