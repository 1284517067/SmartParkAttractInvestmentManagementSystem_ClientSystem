import request from "./request";
export default {
  getApprovalProcessByLimit(posData) {
    return request({
      url: "/getApprovalProcessByLimit",
      data: posData,
      method: "post"
    });
  },
  getApprovalProcessTotal() {
    return request({
      url: "/getApprovalProcessTotal",
      method: "get"
    });
  },
  postApprovalProcess(posData) {
    return request({
      url: "/postApprovalProcess",
      data: posData,
      method: "post"
    });
  },
  searchApprovalProcessByKey(posData) {
    return request({
      url: "/searchApprovalProcessByKey",
      data: posData,
      method: "post"
    });
  },
  switchApprovalProcessStatus(posData) {
    return request({
      url: "/switchApprovalProcessStatus",
      data: posData,
      method: "post"
    });
  },
  getApprovalProcessArrayData() {
    return request({
      url: "/getApprovalProcessArrayData",
      method: "get"
    });
  },
  deleteApprovalProcessData(posData) {
    return request({
      url: "/deleteApprovalProcessData",
      data: posData,
      method: "post"
    });
  }
};
