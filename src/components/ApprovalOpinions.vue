<template>
  <div class="full-width">
    <el-col v-for="item in approvalProcess" :key="item.num">
      <el-form-item :label="item.approvalProcessNodeName + '意见'">
        <el-input type="textarea" v-model="item.opinion" disabled></el-input>
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
import ApprovalProcessNodeApi from "@/api/ApprovalProcessNodeApi";
import ApprovalOpinionApi from "@/api/ApprovalOpinionApi";

export default {
  name: "ApprovalOpinions",
  props: ["contractType", "id", "formStatus"],
  data() {
    return {
      approvalProcess: [],
      type: this.contractType,
      formId: this.id,
      status: this.formStatus
    };
  },
  methods: {
    mountData() {
      if (this.formStatus === "已发") {
        /**
         * 装载领导审批意见
         * */
        this.getApprovalOpinion();
      } else {
        this.getApprovalProcess();
      }
    },
    getApprovalProcess() {
      ApprovalProcessNodeApi.getApprovalProcessNodesByContractType({
        contractType: this.type
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.approvalProcess = response.data.approvalProcess;
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    getApprovalOpinion() {
      ApprovalOpinionApi.getApprovalOpinionStepByFormId({
        formId: this.formId,
        contractType: this.type
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.approvalProcess = response.data.step;
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.mountData();
  }
};
</script>

<style scoped></style>
