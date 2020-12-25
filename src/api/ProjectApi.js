import request from "./request";
export default {
  getProjectTableData(posData) {
    return request({
      url: "/getProjectTableData",
      data: posData,
      method: "post"
    });
  },
  getProjectDataByProjectId(posData) {
    return request({
      url: "/getProjectDataByProjectId",
      data: posData,
      method: "post"
    });
  },
  updateProjectData(posData) {
    return request({
      url: "/updateProject",
      data: posData,
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      transformRequest: function(data) {
        return JSON.stringify(data);
      }
    });
  },
  deleteProject(posData) {
    return request({
      url: "/deleteProject",
      data: posData,
      method: "post"
    });
  },
  handleProject(posData) {
    return request({
      url: "/handleProject",
      data: posData,
      method: "post"
    });
  },
  searchProjectByKey(posData) {
    return request({
      url: "/searchProjectByKey",
      data: posData,
      method: "post"
    });
  },
  getDeletedProjectListData(posData) {
    return request({
      url: "/getDeletedProjectListData",
      data: posData,
      method: "post"
    });
  },
  recoverProjectData(posData) {
    return request({
      url: "/recoverProject",
      data: posData,
      method: "post"
    });
  },
  searchDeletedProjectByKey(posData) {
    return request({
      url: "/searchDeletedProjectByKey",
      data: posData,
      method: "post"
    });
  },
  getPersonProjectTableData(posData) {
    return request({
      url: "/getPersonProjectTableData",
      data: posData,
      method: "post"
    });
  },
  getPersonProjectTableByKey(posData) {
    return request({
      url: "/getPersonProjectTableByKey",
      data: posData,
      method: "post"
    });
  }
};
