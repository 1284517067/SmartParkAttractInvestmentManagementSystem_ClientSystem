import request from "./request";
export default {
  getDepartmentListData() {
    return request({
      url: "/getDepartmentListData",
      method: "get"
    });
  },
  getDepartmentTreeData() {
    return request({
      url: "/getDepartmentTreeData",
      method: "get"
    });
  },
  createDepartment(posData) {
    return request({
      url: "/createDepartment",
      data: posData,
      method: "post"
    });
  },
  getDepartmentTableData(posData) {
    return request({
      url: "/getDepartmentTableData",
      data: posData,
      method: "post"
    });
  },
  getDepartmentTotalData() {
    return request({
      url: "/getDepartmentTotal",
      method: "get"
    });
  },
  deleteDepartmentByDepartmentId(posData) {
    return request({
      url: "/deleteDepartmentByDepartmentId",
      data: posData,
      method: "post"
    });
  },
  getDepartmentDataByKey(posData) {
    return request({
      url: "/getDepartmentDataByKey",
      data: posData,
      method: "post"
    });
  },
  getDepartmentIdByPositionId(posData) {
    return request({
      url: "/getDepartmentByPositionId",
      data: posData,
      method: "post"
    });
  }
};
