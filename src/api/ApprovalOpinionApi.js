import request from "./request";
export default {
  getApprovalOpinionsByFormId(posData) {
    return request({
      url: "/getApprovalOpinionsByFormId",
      data: posData,
      method: "post"
    });
  },
  getApprovalOpinionStepByFormId(posData) {
    return request({
      url: "/getApprovalOpinionStepByFormId",
      data: posData,
      method: "post"
    });
  },
  submitOpinionData(posData) {
    return request({
      url: "/updateOpinion",
      data: posData,
      method: "post"
    });
  }
};
