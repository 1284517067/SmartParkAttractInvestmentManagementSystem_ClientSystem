import request from "./request";
export default {
  getLeaseContractTableData(posData) {
    return request({
      url: "/getLeaseContractTableData",
      data: posData,
      method: "post"
    });
  },
  getLeaseContractFormData(posData) {
    return request({
      url: "/getLeaseContractFormData",
      data: posData,
      method: "post"
    });
  },
  saveLeaseContract(posData) {
    return request({
      url: "/saveLeaseContract",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  sendLeaseContract(posData) {
    return request({
      url: "/sendLeaseContract",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  deleteLeaseContract(posData) {
    return request({
      url: "/deleteLeaseContract",
      data: posData,
      method: "post"
    });
  },
  searchLeaseContractByKey(posData) {
    return request({
      url: "/searchLeaseContractByKey",
      data: posData,
      method: "post"
    });
  }
};
