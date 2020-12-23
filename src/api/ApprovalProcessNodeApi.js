import request from "./request";
import qs from "qs";
export default {
  getApprovalProcessNode(posData) {
    return request({
      url: "/getApprovalProcessNodeData",
      data: posData,
      method: "post"
    });
  },
  postApprovalProcessNodeForm(posData) {
    return request({
      url: "/postApprovalProcessNodeForm",
      data: posData,
      method: "post"
      /*
      headers: { "Content-Type": "application/json;charset=UTF-8" }
*/
    });
  },
  getApprovalProcessNodeListData(posData) {
    return request({
      url: "/getApprovalProcessNodeListData",
      data: posData,
      method: "post"
    });
  },
  getApprovalProcessNodeCountData() {
    return request({
      url: "/getApprovalProcessNodeCount",
      method: "get"
    });
  },
  deleteApprovalProcessNodeByApprovalProcessId(posData) {
    return request({
      url: "/deleteApprovalProcessNodeByApprovalProcessId",
      data: posData,
      method: "post"
    });
  },
  getApprovalProcessNodeListByKey(posData) {
    return request({
      url: "/getApprovalProcessNodeListByKey",
      data: posData,
      method: "post"
    });
  }
};
