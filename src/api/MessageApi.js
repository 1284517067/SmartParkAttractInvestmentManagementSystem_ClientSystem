import request from "./request";
export default {
  getMessagesData(posData) {
    return request({
      url: "/getMessagesData",
      data: posData,
      method: "post"
    });
  },
  getMessagesCountData(posData) {
    return request({
      url: "/getMessagesCountData",
      data: posData,
      method: "post"
    });
  },
  generateMessageCountData(posData) {
    return request({
      url: "/generateMessageCountData",
      data: posData,
      method: "post"
    });
  }
};
