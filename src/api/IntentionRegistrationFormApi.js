import request from "./request";
export default {
  getIntentionRegistrationFormTableData(posData) {
    return request({
      url: "/getIntentionRegistrationFormTableData",
      data: posData,
      method: "post"
    });
  },
  updateIntentionRegistrationForm(posData) {
    return request({
      url: "/updateIntentionRegistrationForm",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  getIntentionRegistrationFormDetail(posData) {
    return request({
      url: "/getIntentionRegistrationFormDetail",
      data: posData,
      method: "post"
    });
  },
  sendIntentionRegistrationForm(posData) {
    return request({
      url: "/sendIntentionRegistrationForm",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  getIntentionRegistrationFormTableByKey(posData) {
    return request({
      url: "/getIntentionRegistrationFormTableByKey",
      data: posData,
      method: "post"
    });
  },
  deleteIntentionRegistrationForm(posData) {
    return request({
      url: "/deleteIntentionRegistrationForm",
      data: posData,
      method: "post"
    });
  }
};
