import request from "./request";
export default {
  getEnterApplicationTableData(posData) {
    return request({
      url: "/getEnterApplicationTableData",
      data: posData,
      method: "post"
    });
  },
  getEnterApplicationDetailData(posData) {
    return request({
      url: "/getEnterApplicationDetailData",
      data: posData,
      method: "post"
    });
  },
  saveEnterApplication(posData) {
    return request({
      url: "/saveEnterApplication",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  sendEnterApplication(posData) {
    return request({
      url: "/sendEnterApplication",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  }
};
