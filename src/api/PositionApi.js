import request from "./request";
export default {
  getPositionByDepartmentId(posData) {
    return request({
      url: "/getPositionByDepartmentId",
      data: posData,
      method: "post"
    });
  },
  getPositionTableData(posData) {
    return request({
      url: "/getPositionTableData",
      data: posData,
      method: "post"
    });
  },
  getPositionTotalData() {
    return request({
      url: "/getPositionTotal",
      method: "get"
    });
  },
  createPosition(posData) {
    return request({
      url: "/createPosition",
      data: posData,
      method: "post"
    });
  },
  deletePositionByPositionId(posData) {
    return request({
      url: "/deletePositionByPositionId",
      data: posData,
      method: "post"
    });
  },
  getPositionDataByKey(posData) {
    return request({
      url: "/getPositionDataByKey",
      data: posData,
      method: "post"
    });
  }
};
