<template>
  <div class="full-width full-height">
    <el-tag
      class="float-right"
      :type="switchTagStyle(intentionRegistrationForm.approvalStatus)"
      style="font-size: 20px ;height: 40px; padding-top: 5px; margin-right: 1%"
    >
      <i
        :class="switchTagIcon(intentionRegistrationForm.approvalStatus)"
        style="font-size: 20px"
      ></i>
      {{ intentionRegistrationForm.approvalStatus }}</el-tag
    >
    <el-row :gutter="20">
      <el-form
        :model="intentionRegistrationForm"
        ref="intentionRegistrationForm"
      >
        <el-col>
          <el-form-item label="合同名称">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.formName"
              class="full-width"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="企业名称">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.enterpriseName"
              class="full-width"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业所属地区">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.enterpriseArea"
              class="full-width"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="来源类型">
            <el-select
              v-model="intentionRegistrationForm.source"
              placeholder="请选择来源类型"
              class="full-width"
              disabled
            >
              <el-option label="自主开发" value="自主开发"></el-option>
              <el-option label="企业介绍" value="企业介绍"></el-option>
              <el-option label="主动上门" value="主动上门"></el-option>
              <el-option label="招商会" value="招商会"></el-option>
              <el-option label="其他渠道" value="其他渠道"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行业类型">
            <el-select
              placeholder="请选择"
              v-model="intentionRegistrationForm.industryTypeId"
              @focus="getIndustryTypeSelect"
              class="full-width"
              disabled
            >
              <el-option
                v-for="item in industryTypeList"
                :key="item.industryTypeId"
                :label="item.industryTypeName"
                :value="item.industryTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同类型">
            <el-select
              v-model="intentionRegistrationForm.contractType"
              class="full-width"
              disabled
            >
              <el-option label="租赁合同" value="租赁合同"></el-option>
              <el-option label="物业合同" value="物业合同"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.contact"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人电话">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.contactTel"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人部门">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.contactDepartment"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人职位">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.contactPosition"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系QQ">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.qq"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系邮箱">
            <el-input
              type="email"
              v-model="intentionRegistrationForm.contactEmail"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业电话">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.enterpriseTel"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业网址">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.enterpriseUrl"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业法人">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.enterpriseLegalPerson"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成立时间">
            <el-date-picker
              v-model="intentionRegistrationForm.registrationTime"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              disabled
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="注册资本（万）">
            <el-input
              type="text"
              v-model.number="intentionRegistrationForm.registeredCapital"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工商注册类型">
            <el-select
              placeholder="请选择工商注册类型"
              v-model="intentionRegistrationForm.businessRegistrationType"
              class="full-width"
              disabled
            >
              <el-option label="国有经济" value="国有经济"></el-option>
              <el-option label="有限责任公司" value="有限责任公司"></el-option>
              <el-option label="集体经济" value="集体经济"></el-option>
              <el-option label="私营经济" value="私营经济"></el-option>
              <el-option label="个体经济" value="个体经济"></el-option>
              <el-option label="联营经济" value="联营经济"></el-option>
              <el-option label="股份制" value="股份制"></el-option>
              <el-option label="外商投资" value="外商投资"></el-option>
              <el-option label="港澳台投资" value="港澳台投资"></el-option>
              <el-option label="其他经济" value="其他经济"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责部门">
            <el-select
              v-model="intentionRegistrationForm.departmentId"
              @focus="getDepartmentSelect"
              class="full-width"
              disabled
            >
              <el-option
                v-for="item in departments"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门经理">
            <el-select
              v-model="intentionRegistrationForm.departmentManager"
              @focus="getDepartmentManagers"
              class="full-width"
              disabled
            >
              <el-option
                v-for="item in managers"
                :label="item"
                :value="item"
                :key="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.principal"
              class="full-width"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请日期">
            <el-date-picker
              v-model="intentionRegistrationForm.applyDate"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              disabled
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审批状态">
            <el-input
              type="text"
              v-model="intentionRegistrationForm.approvalStatus"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import IndustryTypeApi from "@/api/IndustryTypeApi";
import DepartmentApi from "@/api/DepartmentApi";
import UserApi from "@/api/UserApi";
import ApprovalApi from "@/api/ApprovalApi";

export default {
  name: "IntentionRegistrationForm",
  props: ["formId", "contractType"],
  data() {
    return {
      intentionRegistrationForm: {},
      departments: [],
      managers: [],
      industryTypeList: [],
      tagStyle: ""
    };
  },
  methods: {
    getFormData() {
      ApprovalApi.getFormData({
        formId: this.formId,
        contractType: this.contractType
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.intentionRegistrationForm = response.data.form;
            this.switchTagIcon();
            this.switchTagStyle();
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
    getIndustryTypeSelect() {
      IndustryTypeApi.getIndustryTypeSelectData()
        .then(response => {
          if (response.data.responseCode === 200) {
            this.industryTypeList = response.data.industryTypeList;
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
    getDepartmentSelect() {
      DepartmentApi.getDepartmentListData()
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.departments = response.data.positionArrayData;
              break;
            case 400:
              break;
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
    getDepartmentManagers() {
      if (this.intentionRegistrationForm.departmentId === "") {
        this.$message({
          showClose: true,
          message: "请先选择负责部门",
          type: "error"
        });
        return;
      }
      UserApi.getUserListByPosition({
        departmentId: this.intentionRegistrationForm.departmentId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.managers = response.data.managers;
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
        case "审批完成":
          return "success";
        default:
          return "primary";
      }
    },
    switchTagIcon(status) {
      switch (status) {
        case "拒绝":
          return "el-icon-document-delete";
        case "审批完成":
          return "el-icon-document-checked";
        default:
          return "el-icon-document-copy";
      }
    }
  },
  mounted() {
    this.getFormData();
  }
};
</script>

<style scoped></style>
