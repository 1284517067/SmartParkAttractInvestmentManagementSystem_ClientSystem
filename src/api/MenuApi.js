import request from "./request";
export default {
  getUserMenu() {
    return request({
      url: "/getMenu",
      method: "get"
    });
  },
  getMenuTreeData() {
    return request({
      url: "/getMenuTree",
      method: "get"
    });
  },
  getAllMenuTreeData() {
    return request({
      url: "/getAllMenuTree",
      method: "get"
    });
  },
  getMenuListData() {
    return request({
      url: "/getMenuList",
      method: "get"
    });
  },
  updateMenu(posData) {
    return request({
      url: "/updateMenu",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  deleteMenu(posData) {
    return request({
      url: "/deleteMenu",
      data: posData,
      method: "post"
    });
  },
  getMenuPrivilegesData(posData) {
    return request({
      url: "/getMenuPrivileges",
      data: posData,
      method: "post"
    });
  },
  submitPrivilegesForm(posData) {
    return request({
      url: "/submitPrivileges",
      data: posData,
      method: "post"
    });
  }
};
