<template>
  <div class="full-width">
    <el-col v-for="item in approvalProcess" :key="item.num">
      <el-form>
        <el-form-item :label="item.approvalProcessNodeName + '意见'">
          <div
            class="float-right"
            v-if="item.status !== undefined && item.status !== ''"
          >
            <el-tag
              :type="switchTagStyle(item.status)"
              style="font-size: 10px ;height: 30px; padding-top: 2px; margin-right: 1%"
            >
              <i
                :class="switchTagIcon(item.status)"
                style="font-size: 20px"
              ></i>
              {{ item.status }}</el-tag
            >
          </div>

          <el-input type="textarea" v-model="item.opinion" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import ApprovalProcessNodeApi from "@/api/ApprovalProcessNodeApi";
import ApprovalOpinionApi from "@/api/ApprovalOpinionApi";

export default {
  name: "ApprovalOpinions",
  props: ["contractType", "id", "formStatus", "businessType"],
  data() {
    return {
      approvalProcess: [],
      type: this.contractType,
      formId: this.id,
      status: this.formStatus,
      bType: this.businessType
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
        contractType: this.type,
        businessType: this.bType
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
    },
    switchTagStyle(status) {
      switch (status) {
        case "拒绝":
          return "danger";
        case "同意":
          return "success";
        default:
          return "primary";
      }
    },
    switchTagIcon(status) {
      switch (status) {
        case "拒绝":
          return "el-icon-document-delete";
        case "同意":
          return "el-icon-document-checked";
        default:
          return "el-icon-document-copy";
      }
    }
  },
  mounted() {
    this.mountData();
  },
  watch: {
    /*  bType() {
      this.mountData();
    },
    formId() {
      this.mountData();
    }*/
  }
};
</script>

<style scoped></style>
