import request from "./request";
export default {
  getSpaceTreeData() {
    return request({
      url: "/getSpaceTree",
      method: "get"
    });
  },
  lazyLoadSpaceLeaf(posData) {
    return request({
      url: "/lazyLoadSpaceLeaf",
      data: posData,
      method: "post"
    });
  },
  submitSpaceForm(posData) {
    return request({
      url: "/submitSpaceForm",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  deleteSpaceData(posData) {
    return request({
      url: "/deleteSpace",
      data: posData,
      method: "post"
    });
  },
  getParkSelect() {
    return request({
      url: "/getParkSelect",
      method: "get"
    });
  },
  getIntentionAgreementComponentSpaceData(posData) {
    return request({
      url: "/getIntentionAgreementComponentSpaceData",
      data: posData,
      method: "post"
    });
  },
  lazyLoadIntentionAgreementSpaceLeaf(posData) {
    return request({
      url: "/lazyLoadIntentionAgreementSpaceLeaf",
      data: posData,
      method: "post"
    });
  },
  getLeaseContractSpaceData(posData) {
    return request({
      url: "/getLeaseContractSpaceData",
      data: posData,
      method: "post"
    });
  }
};
