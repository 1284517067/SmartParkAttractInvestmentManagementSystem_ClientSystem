import request from "./request";
export default {
  getFormData(posData) {
    return request({
      url: "/getFormData",
      data: posData,
      method: "post"
    });
  }
};
