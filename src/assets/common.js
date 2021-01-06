import ApprovalProcessNodeApi from "@/api/ApprovalProcessNodeApi";
import Vue from "vue";

let vue = new Vue();

export default {
  methods: {
    getApprovalProcess(type) {
      ApprovalProcessNodeApi.getApprovalProcessNodesByContractType({
        contractType: type
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            return response.data.approvalProcess;
          }
        })
        .catch(error => {
          vue.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    }
  }
};
