import request from "./request";
export default {
  getIntentionAgreementTableData(posData) {
    return request({
      url: "/getIntentionAgreementTableData",
      data: posData,
      method: "post"
    });
  },
  getIntentionAgreementForm(posData) {
    return request({
      url: "/getIntentionAgreementForm",
      data: posData,
      method: "post"
    });
  },
  saveIntentionAgreementForm(posData) {
    return request({
      url: "/saveIntentionAgreementForm",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  sendIntentionAgreementFrom(posData) {
    return request({
      url: "/sendIntentionAgreementFrom",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  deleteIntentionAgreement(posData) {
    return request({
      url: "/deleteIntentionAgreement",
      data: posData,
      method: "post"
    });
  },
  searchByKey(posData) {
    return request({
      url: "/searchIntentionAgreementByKey",
      data: posData,
      method: "post"
    });
  }
};
