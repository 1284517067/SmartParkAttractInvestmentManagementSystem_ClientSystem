<template>
  <div class="full-width full-height">
    <el-form>
      <el-col v-for="item in approvalProcess" :key="item.num">
        <el-form-item
          :label="item.approvalProcessNodeName + '意见'"
          v-if="
            item.positionId === user.positionId && item.opinion === undefined
          "
        >
          <el-input
            type="textarea"
            v-model="opinion"
            placeholder="请输入审批意见"
          ></el-input>
        </el-form-item>
        <el-form-item :label="item.approvalProcessNodeName + '意见'" v-else>
          <el-input type="textarea" v-model="item.opinion" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-button
      type="info"
      @click="submitOpinion('拒绝')"
      :loading="rejectLoading"
      :disabled="rejectDisable"
      >拒绝</el-button
    >
    <el-button
      type="primary"
      @click="submitOpinion('同意')"
      :loading="agreeLoading"
      :disabled="agreeDisable"
      >同意</el-button
    >
    <p></p>
  </div>
</template>

<script>
import ApprovalProcessNodeApi from "@/api/ApprovalProcessNodeApi";
import ApprovalOpinionApi from "@/api/ApprovalOpinionApi";
import ApprovalApi from "@/api/ApprovalApi";

export default {
  name: "OpinionComponent",
  props: ["contractType", "id", "messageId", "messageType"],
  data() {
    return {
      approvalProcess: [],
      type: this.contractType,
      formId: this.id,
      user: {},
      opinion: "",
      opinionId: "",
      agreeLoading: false,
      rejectLoading: false,
      agreeDisable: false,
      rejectDisable: false
    };
  },
  methods: {
    mountData() {
      this.user = JSON.parse(localStorage.getItem("userInfo"));
      if (this.messageType !== "待办") {
        this.rejectDisable = true;
        this.agreeDisable = true;
      }
      this.getApprovalOpinion();
    },
    getApprovalOpinion() {
      ApprovalOpinionApi.getApprovalOpinionStepByFormId({
        formId: this.formId,
        contractType: this.type
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.approvalProcess = response.data.step;
            this.approvalProcess.forEach(item => {
              if (item.positionId === this.user.positionId) {
                this.opinionId = item.opinionId;
              }
            });
            console.log(this.approvalProcess);
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
    submitOpinion(opinionType) {
      if (this.opinion === "") {
        this.$message({
          showClose: true,
          message: "请输入审批意见",
          type: "error"
        });
        return;
      }
      switch (opinionType) {
        case "同意":
          this.agreeLoading = true;
          this.rejectDisable = true;
          break;
        case "拒绝":
          this.rejectLoading = true;
          this.agreeDisable = true;
          break;
      }
      let user = JSON.parse(localStorage.getItem("userInfo"));
      ApprovalOpinionApi.submitOpinionData({
        opinionId: this.opinionId,
        formId: this.formId,
        opinion: this.opinion,
        status: opinionType,
        contractType: this.type,
        messageId: this.messageId,
        principal: user.username
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "success"
            });
          }
          this.resetSubmitButton();
          this.$router.go(0);
        })
        .catch(error => {
          this.resetSubmitButton();
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    resetSubmitButton() {
      this.agreeDisable = false;
      this.agreeLoading = false;
      this.rejectLoading = false;
      this.rejectDisable = false;
    }
  },
  mounted() {
    this.mountData();
  }
};
</script>

<style scoped></style>
