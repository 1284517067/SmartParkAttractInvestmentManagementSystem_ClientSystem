import request from "./request";
export default {
  getPayItemTableData(posData) {
    return request({
      url: "/getPayItemTableData",
      data: posData,
      method: "post"
    });
  },
  updatePayItem(posData) {
    return request({
      url: "/updatePayItem",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  deletePayItem(posData) {
    return request({
      url: "/deletePayItem",
      data: posData,
      method: "post"
    });
  },
  getPayItemDetail(posData) {
    return request({
      url: "/getPayItemDetail",
      data: posData,
      method: "post"
    });
  },
  searchPayItemByKey(posData) {
    return request({
      url: "/searchPayItemByKey",
      data: posData,
      method: "post"
    });
  },
  getPayItemList() {
    return request({
      url: "/getPayItemList",
      method: "get"
    });
  },
  getPayItemFormulasByItemId(posData) {
    return request({
      url: "/getPayItemFormulasByItemId",
      data: posData,
      method: "post"
    });
  },
  getLeaseContractPayItemData(posData) {
    return request({
      url: "/getLeaseContractPayItemData",
      data: posData,
      method: "post"
    });
  }
};
