import request from "./request";
export default {
  login(posData) {
    return request({
      url: "/login",
      data: posData,
      method: "post"
    });
  }
};
