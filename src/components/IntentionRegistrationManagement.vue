<template>
  <div class="full-height">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        智慧招商
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        项目中心
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        意向登记
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title-padding-bottom"></div>

    <!-- 意向登记模态框 -->
    <el-dialog
      title="意向登记"
      :visible.sync="modalFormVisible"
      width="80%"
      show-close
      destroy-on-close
      :before-close="closeModal"
      modal
    >
      <div class="float-right">
        <el-button
          type="primary"
          v-if="
            intentionRegistrationForm.status === '' ||
              intentionRegistrationForm.status === '待发'
          "
          :loading="sendLoading"
          @click="sendForm"
          >送办</el-button
        >
        <el-button type="primary" :loading="submitLoading" @click="saveForm"
          >保存</el-button
        >
      </div>
      <div class="title-padding-bottom"></div>
      <el-row :gutter="20">
        <el-form
          :model="intentionRegistrationForm"
          :rules="rules"
          ref="intentionRegistrationForm"
        >
          <el-col>
            <el-form-item label="企业名称" prop="enterpriseName">
              <el-input
                type="text"
                v-model="intentionRegistrationForm.enterpriseName"
                class="full-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业所属地区" prop="enterpriseArea">
              <el-input
                type="text"
                v-model="intentionRegistrationForm.enterpriseArea"
                class="full-width"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源类型" prop="source">
              <el-select
                v-model="intentionRegistrationForm.source"
                placeholder="请选择来源类型"
                class="full-width"
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
            <el-form-item label="行业类型" prop="industryTypeId">
              <el-select
                placeholder="请选择"
                v-model="intentionRegistrationForm.industryTypeId"
                @focus="getIndustryTypeSelect"
                class="full-width"
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
            <el-form-item label="合同类型" prop="contractType">
              <el-select
                v-model="intentionRegistrationForm.contractType"
                class="full-width"
                clearable
              >
                <el-option label="租赁合同" value="租赁合同"></el-option>
                <el-option label="物业合同" value="物业合同"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="contact">
              <el-input
                type="text"
                v-model="intentionRegistrationForm.contact"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人电话" prop="contactTel">
              <el-input
                type="text"
                v-model="intentionRegistrationForm.contactTel"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人部门" prop="contactDepartment">
              <el-input
                type="text"
                v-model="intentionRegistrationForm.contactDepartment"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人职位" prop="contactPosition">
              <el-input
                type="text"
                v-model="intentionRegistrationForm.contactPosition"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系QQ" prop="qq">
              <el-input
                type="text"
                v-model="intentionRegistrationForm.qq"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系邮箱" prop="contactEmail">
              <el-input
                type="email"
                v-model="intentionRegistrationForm.contactEmail"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业电话" prop="enterpriseTel">
              <el-input
                type="text"
                v-model="intentionRegistrationForm.enterpriseTel"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业网址" prop="enterpriseUrl">
              <el-input
                type="text"
                v-model="intentionRegistrationForm.enterpriseUrl"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业法人" prop="enterpriseLegalPerson">
              <el-input
                type="text"
                v-model="intentionRegistrationForm.enterpriseLegalPerson"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成立时间" prop="registrationTime">
              <el-date-picker
                v-model="intentionRegistrationForm.registrationTime"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册资本（万）" prop="registeredCapital">
              <el-input
                type="text"
                v-model.number="intentionRegistrationForm.registeredCapital"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工商注册类型" prop="businessRegistrationType">
              <el-select
                placeholder="请选择工商注册类型"
                v-model="intentionRegistrationForm.businessRegistrationType"
                class="full-width"
              >
                <el-option label="国有经济" value="国有经济"></el-option>
                <el-option
                  label="有限责任公司"
                  value="有限责任公司"
                ></el-option>
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
            <el-form-item label="负责部门" prop="departmentId">
              <el-select
                v-model="intentionRegistrationForm.departmentId"
                @focus="getDepartmentSelect"
                class="full-width"
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
            <el-form-item label="部门经理" prop="departmentManager">
              <el-select
                v-model="intentionRegistrationForm.departmentManager"
                @focus="getDepartmentManagers"
                class="full-width"
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
          <!-- <template v-if="approvalProcess.length !== 0">
            <el-col
              v-for="item in approvalProcess"
              :key="item.approvalProcessNodeId"
            >
              <el-form-item :label="item.approvalProcessNodeName + '意见'">
                <el-input
                  type="textarea"
                  v-model="item.opinion"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </template>-->
          <ApprovalOpinions
            contract-type="意向登记"
            :id="intentionRegistrationForm.formId"
            :form-status="intentionRegistrationForm.status"
          ></ApprovalOpinions>
        </el-form>
      </el-row>
    </el-dialog>
    <!-- 意向登记模态框结束 -->

    <div class="content-block">
      <el-row>
        <el-col :span="4">
          <el-input v-model="searchKey" placeholder="请输入关键字"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            :loading="searchLoading"
            @click="searchByKey"
            >查询</el-button
          >
          <el-button type="primary" @click="resetTableData">重置</el-button>
        </el-col>
      </el-row>
      <div class="float-right">
        <el-button type="primary" @click="handleNewForm">新增</el-button>
      </div>
      <div class="title-padding-bottom"></div>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="待发" name="待发"></el-tab-pane>
        <el-tab-pane label="已发" name="已发"></el-tab-pane>
      </el-tabs>
      <el-table :data="tableData" v-loading="tableLoading" max-height="500">
        <el-table-column label="申请时间" prop="applyDate"></el-table-column>
        <el-table-column
          label="企业名称"
          prop="enterpriseName"
        ></el-table-column>
        <el-table-column
          label="企业所属地区"
          prop="enterpriseArea"
        ></el-table-column>
        <el-table-column label="行业类型" prop="industryTypeName">
        </el-table-column>
        <el-table-column label="注册资本（万）" prop="registeredCapital">
        </el-table-column>
        <el-table-column label="来源方式" prop="source"> </el-table-column>
        <el-table-column label="联系人" prop="contact"> </el-table-column>
        <el-table-column label="联系电话" prop="contactTel"> </el-table-column>
        <el-table-column label="状态" prop="approvalStatus"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              content="查看审批进度"
              effect="dark"
              placement="top"
              v-if="activeName === '已发'"
            >
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
                  @click="getApprovalStep(scope.row)"
                >
                  <i class="el-icon-finished"></i>
                </el-button>
              </el-popover>
            </el-tooltip>
            <el-tooltip
              content="编辑"
              effect="dark"
              placement="top"
              v-if="activeName === '待发'"
            >
              <el-button type="text" @click="handleEdit(scope.row)">
                <i class="el-icon-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              content="删除"
              effect="dark"
              placement="top"
              v-if="activeName === '待发'"
            >
              <el-popconfirm
                title="确认删除该记录吗？"
                cancel-button-text="取消"
                cancel-button-type="default"
                confirm-button-type="primary"
                confirm-button-text="确定"
                @confirm="deleteData(scope.row)"
              >
                <el-button type="text" slot="reference">
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="top-padding"></div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        layout="total,  sizes , prev , pager , next , jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import IndustryTypeApi from "@/api/IndustryTypeApi";
import DepartmentApi from "@/api/DepartmentApi";
import IntentionRegistrationFormApi from "@/api/IntentionRegistrationFormApi";
import ApprovalProcessNodeApi from "@/api/ApprovalProcessNodeApi";
import common from "@/assets/common";
import ApprovalOpinions from "@/components/ApprovalOpinions";
import UserApi from "@/api/UserApi";
import { formatDate } from "@/assets/date";
import ApprovalOpinionApi from "@/api/ApprovalOpinionApi";

let checkPhone = (rule, value, callback) => {
  let reg = /^1[345789]\d{9}$/;
  if (!reg.test(value)) {
    callback(new Error("请输入11位手机号"));
  } else {
    callback();
  }
};
export default {
  name: "IntentionRegistrationManagement",
  components: { ApprovalOpinions },
  mixins: [common],
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      tableData: [],
      tableLoading: false,
      total: 0,
      limit: 10,
      currentPage: 1,
      activeName: "待发",
      modalFormVisible: false,
      intentionRegistrationForm: {
        formId: "",
        enterpriseName: "",
        enterpriseArea: "",
        industryTypeId: "",
        source: "",
        contact: "",
        contactTel: "",
        contactDepartment: "",
        contactPosition: "",
        qq: "",
        contactEmail: "",
        enterpriseTel: "",
        enterpriseUrl: "",
        enterpriseLegalPerson: "",
        registrationTime: "",
        registeredCapital: "",
        departmentId: "",
        departmentManager: "",
        applyDate: "",
        principal: "",
        contractType: "",
        businessRegistrationType: "",
        status: "",
        approvalStatus: ""
      },
      rules: {
        enterpriseName: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        enterpriseArea: [
          { required: true, message: "请输入企业所属地区", trigger: "blur" }
        ],
        industryTypeId: [
          { required: true, message: "请选择行业类型", trigger: "change" }
        ],
        source: [
          { required: true, message: "请选择来源方式", trigger: "change" }
        ],
        contractType: [
          { required: true, message: "请选择合同类型", trigger: "change" }
        ],
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contactTel: [
          { required: true, message: "请输入联系人电话号码", trigger: "blur" },
          {
            type: "number",
            validator: checkPhone,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        contactDepartment: [
          { required: true, message: "请输入联系人所属部门", trigger: "blur" }
        ],
        contactPosition: [
          { required: true, message: "请输入联系人职位", trigger: "blur" }
        ],
        contactEmail: [
          { required: true, message: "请输入企业邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        qq: [
          { required: true, message: "请输入联系人qq号码", trigger: "blur" }
        ],
        enterpriseTel: [
          { required: true, message: "请输入企业电话", trigger: "blur" },
          {
            type: "number",
            validator: checkPhone,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        enterpriseUrl: [
          { required: true, message: "请输入企业网址", trigger: "blur" }
        ],
        enterpriseLegalPerson: [
          { required: true, message: "请输入企业法人", trigger: "blur" }
        ],
        registrationTime: [
          { required: true, message: "请选择成立时间", trigger: "change" }
        ],
        registeredCapital: [
          { required: true, message: "请输入注册资本", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" }
        ],
        departmentId: [
          { required: true, message: "请选择负责部门", trigger: "change" }
        ],
        departmentManager: [
          { required: true, message: "请选择部门经理", trigger: "change" }
        ],
        businessRegistrationType: [
          { required: true, message: "请选择工商注册类型", trigger: "change" }
        ]
      },
      industryTypeList: [],
      departments: [],
      managers: [],
      approvalProcess: [],
      contractType: "意向登记",
      submitLoading: false,
      sendLoading: false,
      activeStep: 0,
      approvalStep: [],
      stepLoading: false
    };
  },
  methods: {
    searchByKey() {
      this.searchLoading = true;
      this.tableLoading = true;
      IntentionRegistrationFormApi.getIntentionRegistrationFormTableByKey({
        searchKey: this.searchKey,
        status: this.activeName
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.tableData = response.data.tableData;
            this.total = response.data.total;
          }
          this.searchLoading = false;
          this.tableLoading = false;
        })
        .catch(error => {
          this.searchLoading = false;
          this.tableLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    resetTableData() {
      this.searchKey = "";
      this.currentPage = 1;
      this.getIntentionRegistrationFormTable();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getIntentionRegistrationFormTable();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getIntentionRegistrationFormTable();
    },
    getIntentionRegistrationFormTable() {
      this.tableLoading = true;
      IntentionRegistrationFormApi.getIntentionRegistrationFormTableData({
        currentPage: this.currentPage,
        limit: this.limit,
        status: this.activeName
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.total = response.data.total;
            this.tableData = response.data.tableData;
          }
          this.tableLoading = false;
        })
        .catch(error => {
          this.tableLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    closeModal() {
      this.$refs.intentionRegistrationForm.resetFields();
      this.intentionRegistrationForm.applyDate = formatDate(
        new Date(),
        "yyyy-MM-dd"
      );
      this.intentionRegistrationForm.formId = "";
      this.intentionRegistrationForm.principal = JSON.parse(
        localStorage.getItem("userInfo")
      ).username;
      this.modalFormVisible = false;
    },
    handleEdit(row) {
      this.approvalProcess = common.methods.getApprovalProcess("意向登记");
      this.getIntentionRegistrationFormById(row.formId);
      this.modalFormVisible = true;
    },
    getIntentionRegistrationFormById(formId) {
      IntentionRegistrationFormApi.getIntentionRegistrationFormDetail({
        formId: formId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.intentionRegistrationForm = response.data.form;
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
    handleTabsClick() {
      this.getIntentionRegistrationFormTable();
    },
    handleNewForm() {
      this.intentionRegistrationForm.principal = JSON.parse(
        localStorage.getItem("userInfo")
      ).username;
      this.intentionRegistrationForm.applyDate = formatDate(
        new Date(),
        "yyyy-MM-dd"
      );
      this.modalFormVisible = true;
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
    saveForm() {
      this.$refs["intentionRegistrationForm"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          IntentionRegistrationFormApi.updateIntentionRegistrationForm({
            intentionRegistrationForm: this.intentionRegistrationForm
          })
            .then(response => {
              if (response.data.responseCode === 200) {
                this.$message({
                  showClose: true,
                  message: response.data.msg,
                  type: "success"
                });
              }
              this.submitLoading = false;
              this.getIntentionRegistrationFormTable();
              this.closeModal();
            })
            .catch(error => {
              this.submitLoading = false;
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
    sendForm() {
      this.$refs["intentionRegistrationForm"].validate(valid => {
        if (valid) {
          this.sendLoading = true;
          IntentionRegistrationFormApi.sendIntentionRegistrationForm({
            form: this.intentionRegistrationForm
          })
            .then(response => {
              if (response.data.responseCode === 200) {
                this.$message({
                  showClose: true,
                  message: response.data.msg,
                  type: "success"
                });
              }
              this.sendLoading = false;
              this.getIntentionRegistrationFormTable();
              this.closeModal();
              setTimeout(() => this.$router.go(0), 500);
            })
            .catch(error => {
              this.sendLoading = false;
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
    getApprovalStep(row) {
      this.stepLoading = true;
      ApprovalOpinionApi.getApprovalOpinionStepByFormId({
        formId: row.formId,
        contractType: "意向登记"
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
    deleteData(row) {
      IntentionRegistrationFormApi.deleteIntentionRegistrationForm({
        formId: row.formId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "success"
            });
          }
          this.getIntentionRegistrationFormTable();
        })
        .catch(error => {
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
  mounted() {
    this.getIntentionRegistrationFormTable();
  }
};
</script>

<style scoped></style>
