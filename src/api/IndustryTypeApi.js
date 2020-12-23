import request from "./request";
export default {
  getIndustryTypes(posData) {
    return request({
      url: "/getIndustryTypes",
      data: posData,
      method: "post"
    });
  },
  getIndustryTypeTree() {
    return request({
      url: "/getIndustryTypeTree",
      method: "get"
    });
  },
  getParentTypeData() {
    return request({
      url: "/getParentTypeData",
      method: "get"
    });
  },
  postNewIndustryTypeData(posData) {
    return request({
      url: "/postNewIndustryType",
      data: posData,
      method: "post"
    });
  },
  deleteIndustryTypeById(posData) {
    return request({
      url: "/deleteIndustryTypeById",
      data: posData,
      method: "post"
    });
  },
  getIndustryTypeDataByKey(posData) {
    return request({
      url: "/getIndustryTypeDataByKey",
      data: posData,
      method: "post"
    });
  },
  getIndustryTypeDataTotalCount() {
    return request({
      url: "/getIndustryTypeDataTotalCount",
      method: "get"
    });
  },
  getIndustryTypeSelectData() {
    return request({
      url: "/getIndustryTypeSelectData",
      method: "get"
    });
  }
};
