import request from "./request";
export default {
  getUserTableByLimit(posData) {
    return request({
      url: "/getUserListByLimit",
      data: posData,
      method: "post"
    });
  },
  updateUser(posData) {
    return request({
      url: "/updateUser",
      data: posData,
      method: "post"
    });
  },
  switchUserStatus(posData) {
    return request({
      url: "/switchUserStatus",
      data: posData,
      method: "post"
    });
  },
  unsubscribeUser(posData) {
    return request({
      url: "/unsubscribeUser",
      data: posData,
      method: "post"
    });
  },
  refreshPassword(posData) {
    return request({
      url: "/refreshPassword",
      data: posData,
      method: "post"
    });
  },
  searchUserByKey(posData) {
    return request({
      url: "searchUserByKey",
      data: posData,
      method: "post"
    });
  },
  getUserListByPosition(posData) {
    return request({
      url: "/getUserListByPosition",
      data: posData,
      method: "post"
    });
  },
  getUsernameList() {
    return request({
      url: "/getUsernameList",
      method: "get"
    });
  }
};
