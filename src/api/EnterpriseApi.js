import request from "./request";
export default {
  getEnterpriseTableData(posData) {
    return request({
      url: "/getEnterpriseTableData",
      data: posData,
      method: "post"
    });
  },
  updateEnterprise(posData) {
    return request({
      url: "/updateEnterprise",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  getEnterpriseDetail(posData) {
    return request({
      url: "/getEnterpriseDetail",
      data: posData,
      method: "post"
    });
  },
  getEnterpriseListByKey(posData) {
    return request({
      url: "/getEnterpriseListByKey",
      data: posData,
      method: "post"
    });
  }
};
