<template>
  <div style="display: inline">
    <el-tooltip content="查看审批进度" effect="dark" placement="top">
      <el-popover placement="right" trigger="click" width="200">
        <el-steps finish-status="success" :active="activeStep">
          <el-step
            v-for="item in approvalStep"
            :title="item.approvalProcessNodeName"
            :description="item.status"
            :status="setStepStatus(item.status, item.opinionId)"
            :key="item.opinionId"
          ></el-step>
        </el-steps>
        <el-button
          type="text"
          slot="reference"
          @click="getApprovalStep(formId)"
        >
          <i class="el-icon-finished"></i>
        </el-button>
      </el-popover>
    </el-tooltip>
  </div>
</template>

<script>
import ApprovalOpinionApi from "@/api/ApprovalOpinionApi";

export default {
  name: "ApprovalProcessStep",
  props: ["formId", "contractType"],
  data() {
    return {
      approvalStep: [],
      activeStep: 0,
      stepLoading: false
    };
  },
  methods: {
    getApprovalStep() {
      this.stepLoading = true;
      ApprovalOpinionApi.getApprovalOpinionStepByFormId({
        formId: this.formId,
        contractType: this.contractType
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.approvalStep = response.data.step;
            for (let i = 0; i < this.approvalStep.length; i++) {
              if (
                this.approvalStep[i].status === "待审批" ||
                this.approvalStep[i].status === "拒绝"
              ) {
                this.activeStep = this.approvalStep[i].opinionId;
                break;
              }
            }
          }
          this.stepLoading = false;
        })
        .catch(error => {
          this.stepLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    setStepStatus(status, opinionId) {
      if (opinionId === this.activeStep) {
        if (status === "拒绝") {
          return "error";
        }
        return "process";
      }
      switch (status) {
        case "待审批":
          return "wait";
        case "同意":
          return "success";
        case "拒绝":
          return "error";
      }
    }
  },
  mounted() {}
};
</script>

<style scoped></style>
