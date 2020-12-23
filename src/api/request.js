// eslint-disable-next-line no-undef
import axios from "axios";
import qs from "qs";
import router from "@/router";
import Vue from "vue";

let vue = new Vue();

const service = axios.create({
  baseURL: "http://localhost:8081",
  timeout: 30000,
  headers: {},
  transformRequest: [
    function(data) {
      return qs.stringify(data);
    }
  ]
});

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(response => {
  if (response.data.responseCode) {
    switch (response.data.responseCode) {
      case 400:
        vue.$message({
          showClose: true,
          message: response.data.msg,
          type: "error"
        });
        break;
      case 401:
        vue.$message({
          showClose: true,
          message: response.data.msg,
          type: "error"
        });
        localStorage.removeItem("Authorization");
        localStorage.removeItem("userInfo");
        router.push("/login");
        break;
    }
  }
  return response;
});

export default service;
