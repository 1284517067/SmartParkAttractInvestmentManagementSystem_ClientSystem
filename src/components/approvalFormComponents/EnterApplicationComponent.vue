<template>
  <div class="full-width">
    <el-row :gutter="20">
      <el-col>
        <div class="float-right" v-if="activeName === '待发'">
          <el-button
            type="primary"
            :disabled="sendDisable"
            :loading="sendLoading"
            @click="sendForm"
            >送办</el-button
          >
          <el-button
            type="primary"
            :disabled="saveDisable"
            :loading="saveLoading"
            @click="saveForm"
            >保存</el-button
          >
        </div>
      </el-col>
      <el-form
        :model="enterApplicationForm"
        :rules="rules"
        ref="enterApplicationForm"
      >
        <el-col :span="12">
          <el-form-item label="客户" prop="enterpriseName">
            <el-input
              type="text"
              class="full-width"
              suffix-icon="el-icon-more"
              v-model="enterApplicationForm.enterpriseName"
              @focus="handleEnterpriseComponentVisible"
              :disabled="itemDisable"
              @clear="clearEnterprise"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同" prop="contractId">
            <el-select
              v-model="enterApplicationForm.contractId"
              class="full-width"
              :disabled="itemDisable"
              @visible-change="handleLeaseContractFocus"
              clearable
            >
              <el-option
                v-for="item in leaseContractList"
                :label="item.formName"
                :value="item.formId"
                :key="item.formId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入驻人数">
            <el-input
              type="text"
              class="full-width"
              v-model.number="enterApplicationForm.enterPopulation"
              :disabled="itemDisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入驻时间" prop="enterTime">
            <el-date-picker
              v-model="enterApplicationForm.enterTime"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :disabled="itemDisable"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入驻负责人" prop="principal">
            <el-select
              v-model="enterApplicationForm.principal"
              class="full-width"
              :disabled="itemDisable"
              @focus="handleUserFocus"
              clearable
            >
              <el-option
                v-for="item in userList"
                :label="item.username"
                :value="item.username"
                :key="item.username"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="入驻说明">
            <el-input
              type="textarea"
              v-model="enterApplicationForm.enterDescription"
              class="full-width"
              :disabled="itemDisable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <!-- 企业选择模态框 -->
    <el-dialog
      width="50%"
      append-to-body
      :visible="enterpriseModalFormVisible"
      show-close
      destroy-on-close
      :before-close="closeEnterpriseModal"
      modal
    >
      <ChangeEnterprise
        v-if="enterpriseModalFormVisible"
        @enterprise-change="handleEnterpriseChange"
      ></ChangeEnterprise>
    </el-dialog>
    <!-- 企业选择模态框结束-->
  </div>
</template>

<script>
import ChangeEnterprise from "@/components/ChangeEnterprise";
import { formatDate } from "@/assets/date";
import LeaseContractApi from "@/api/LeaseContractApi";
import UserApi from "@/api/UserApi";
import EnterApplicationApi from "@/api/EnterApplicationApi";

export default {
  name: "EnterApplicationComponent",
  components: { ChangeEnterprise },
  props: ["formId", "closeModal", "activeName"],
  data() {
    return {
      saveLoading: false,
      saveDisable: false,
      sendLoading: false,
      sendDisable: false,
      itemDisable: false,
      enterApplicationForm: {
        formId: "",
        formName: "",
        enterpriseId: "",
        enterpriseName: "",
        contractId: "",
        contractName: "",
        enterTime: "",
        enterPopulation: "",
        principal: "",
        enterDescription: "",
        status: "",
        approvalStatus: ""
      },
      rules: {
        enterpriseName: [
          { required: true, message: "请选择客户", trigger: "change" }
        ],
        contractId: [
          { required: true, message: "请选择合同", trigger: "change" }
        ],
        enterTime: [
          { required: true, message: "请选择入驻时间", trigger: "change" }
        ],
        principal: [
          { required: true, message: "请选择负责人", trigger: "change" }
        ]
      },
      enterpriseModalFormVisible: false,
      leaseContractModalFormVisible: false,
      userFormVisible: false,
      leaseContractList: [],
      userList: []
    };
  },
  methods: {
    async mountData() {
      if (this.activeName !== "待发") {
        this.itemDisable = true;
      }
      if (this.formId !== undefined && this.formId !== "") {
        await this.getEnterApplicationDetail();
        await this.handleUserFocus();
        await this.handleLeaseContractFocus();
      }
    },
    async getEnterApplicationDetail() {
      await EnterApplicationApi.getEnterApplicationDetailData({
        formId: this.formId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.enterApplicationForm = response.data.enterApplication;
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
    sendForm() {
      this.$refs["enterApplicationForm"].validate(valid => {
        if (valid) {
          this.sendLoading = true;
          this.saveDisable = true;
          EnterApplicationApi.sendEnterApplication({
            enterApplication: this.enterApplicationForm
          })
            .then(response => {
              if (response.data.responseCode === 200) {
                this.$message({
                  showClose: true,
                  message: response.data.msg,
                  type: "success"
                });
              }
              this.resetButtonStatus();
              this.closeParentModal();
            })
            .catch(error => {
              this.resetButtonStatus();
              this.$message({
                showClose: true,
                message: error,
                type: "error"
              });
            });
        } else {
          return false;
        }
      });
    },
    saveForm() {
      this.$refs["enterApplicationForm"].validate(valid => {
        if (valid) {
          this.saveLoading = true;
          this.sendDisable = true;
          EnterApplicationApi.saveEnterApplication({
            enterApplication: this.enterApplicationForm
          })
            .then(response => {
              if (response.data.responseCode === 200) {
                this.$message({
                  showClose: true,
                  message: response.data.msg,
                  type: "success"
                });
              }
              this.resetButtonStatus();
              this.closeParentModal();
            })
            .catch(error => {
              this.resetButtonStatus();
              this.$message({
                showClose: true,
                message: error,
                type: "error"
              });
            });
        } else {
          return false;
        }
      });
    },
    resetButtonStatus() {
      this.saveDisable = false;
      this.sendLoading = false;
      this.sendDisable = false;
      this.saveLoading = false;
    },
    handleEnterpriseComponentVisible() {
      this.enterpriseModalFormVisible = true;
    },
    handleEnterpriseChange(val) {
      this.enterApplicationForm.enterpriseName = val.enterpriseName;
      this.enterApplicationForm.enterpriseId = val.enterpriseId;
      this.enterApplicationForm.formName =
        formatDate(new Date(), "yyyy-MM-dd") +
        "-" +
        this.enterApplicationForm.enterpriseName +
        "-入驻申请";
      this.enterpriseModalFormVisible = false;
    },
    handleLeaseContractComponentVisible() {
      this.leaseContractModalFormVisible = true;
    },

    async handleUserFocus() {
      console.log(2);
      await UserApi.getUsernameList()
        .then(response => {
          if (response.data.responseCode === 200) {
            this.userList = response.data.userList;
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
    async handleLeaseContractFocus() {
      console.log(3);
      if (this.enterApplicationForm.enterpriseId === "") {
        this.$message({
          showClose: true,
          message: "请先选择客户",
          type: "error"
        });
        return;
      }

      await LeaseContractApi.getEnterApplicationComponentLeaseContractData({
        enterpriseId: this.enterApplicationForm.enterpriseId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.leaseContractList = response.data.leaseContractList;
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
    closeEnterpriseModal() {
      this.enterpriseModalFormVisible = false;
    },
    clearEnterprise() {
      this.enterApplicationForm.contractId = "";
      this.leaseContractList = [];
    },
    closeParentModal() {
      if (this.closeModal != null) {
        this.closeModal();
      }
    },
    handleLeaseContractChange() {}
  },
  mounted() {
    this.mountData();
  }
};
</script>

<style scoped></style>
