<template>
  <div style="height: 100%">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        智慧招商
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        项目中心
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        项目公海
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 新增/更新模态框 -->
    <el-dialog
      title="项目公海"
      :visible.sync="modalFormVisible"
      width="80%"
      show-close
      destroy-on-close
      modal
      :before-close="closeModal"
    >
      <el-row align="center" :gutter="40">
        <el-form :model="projectForm" :rules="rules" ref="projectForm">
          <el-col :span="8">
            <el-form-item label="项目ID">
              <el-input
                type="text"
                v-model="projectForm.projectId"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业名称" prop="enterpriseName">
              <el-input
                type="text"
                v-model="projectForm.enterpriseName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业所属地区" prop="enterpriseArea">
              <el-input
                type="text"
                v-model="projectForm.enterpriseArea"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源类型" prop="source">
              <el-select
                v-model="projectForm.source"
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
                v-model="projectForm.industryTypeId"
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
            <el-form-item label="联系人" prop="contact">
              <el-input type="text" v-model="projectForm.contact"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人电话" prop="contactTel">
              <el-input type="text" v-model="projectForm.contactTel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人部门">
              <el-input
                type="text"
                v-model="projectForm.contactDepartment"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人职位">
              <el-input
                type="text"
                v-model="projectForm.contactPosition"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系QQ">
              <el-input type="text" v-model="projectForm.qq"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系邮箱" prop="contactEmail">
              <el-input
                type="email"
                v-model="projectForm.contactEmail"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业电话">
              <el-input
                type="text"
                v-model="projectForm.enterpriseTel"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业网址">
              <el-input
                type="text"
                v-model="projectForm.enterpriseUrl"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业法人">
              <el-input
                type="text"
                v-model="projectForm.enterpriseLegalPerson"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册时间" prop="registrationTime">
              <el-date-picker
                v-model="projectForm.registrationTime"
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
                v-model.number="projectForm.registeredCapital"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属部门">
              <el-select
                v-model="projectForm.departmentId"
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
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button>取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!-- 新增/更新模态框结束 -->

    <div class="content-block">
      <div class="title-padding-bottom"></div>
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
      <div class="title-padding-bottom"></div>
      <el-button type="primary" class="float-right" @click="handleNewProject"
        >新增</el-button
      >
      <div class="title-padding-bottom"></div>
      <el-table height="500px" :data="tableData" v-loading="tableLoading">
        <el-table-column
          label="企业名称"
          prop="enterpriseName"
        ></el-table-column>
        <el-table-column
          label="企业所属地区"
          prop="enterpriseArea"
        ></el-table-column>
        <el-table-column
          label="行业类型"
          prop="industryTypeName"
        ></el-table-column>
        <el-table-column
          label="注册资本"
          prop="registeredCapital"
        ></el-table-column>
        <el-table-column label="联系人" prop="contact"></el-table-column>
        <el-table-column label="联系方式" prop="contactTel"></el-table-column>
        <el-table-column label="项目来源" prop="source"></el-table-column>
        <el-table-column label="负责人" prop="principal"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                type="text"
                class="margin-left-5px"
                @click="handleEditProject(scope.row)"
              >
                <i class="el-icon-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-popconfirm
                title="确认删除项目吗？"
                confirm-button-type="primary"
                confirm-button-text="确定"
                cancel-button-text="取消"
                cancel-button-type="default"
                @confirm="handleProjectDelete(scope.row)"
              >
                <el-button type="text" class="margin-left-5px" slot="reference">
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-popconfirm>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="认领项目"
              placement="top"
              v-if="
                scope.row.principal === '' || scope.row.principal === undefined
              "
            >
              <el-popconfirm
                title="确认认领该项目吗？"
                confirm-button-type="primary"
                confirm-button-text="确定"
                cancel-button-text="取消"
                cancel-button-type="default"
                @confirm="handleHandleProject(scope.row)"
              >
                <el-button type="text" class="margin-left-5px" slot="reference">
                  <i class="el-icon-sell"></i>
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
import ProjectApi from "@/api/ProjectApi";

let checkPhone = (rule, value, callback) => {
  let reg = /^1[345789]\d{9}$/;
  if (!reg.test(value)) {
    callback(new Error("请输入11位手机号"));
  } else {
    callback();
  }
};
export default {
  name: "ProjectSea",
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      tableData: [],
      total: 0,
      limit: 10,
      currentPage: 1,
      projectForm: {
        projectId: "",
        enterpriseName: "",
        enterpriseArea: "",
        industryTypeId: "",
        contact: "",
        contactTel: "",
        contactDepartment: "",
        contactPosition: "",
        qq: "",
        contactEmail: "",
        enterpriseUrl: "",
        enterpriseTel: "",
        enterpriseLegalPerson: "",
        registeredCapital: "",
        registrationTime: "",
        departmentId: "",
        principal: "",
        source: ""
      },
      modalFormVisible: false,
      rules: {
        enterpriseName: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        source: [
          { required: true, message: "请选择来源方式", trigger: "change" }
        ],
        enterpriseArea: [
          { required: true, message: "请输入企业所属地区", trigger: "blur" }
        ],
        industryTypeId: [
          { required: true, message: "请选择行业类型", trigger: "change" }
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
        registrationTime: [
          { required: true, message: "请选择注册时间", trigger: "change" }
        ],
        registeredCapital: [
          { required: true, message: "请输入注册资本", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" }
        ],
        contactEmail: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      industryTypeList: [],
      departments: [],
      submitLoading: false,
      userInfo: {},
      tableLoading: false
    };
  },
  methods: {
    searchByKey() {
      if (this.searchKey === "") {
        this.$message({
          showClose: true,
          message: "请输入关键字",
          type: "error"
        });
        return;
      }
      this.searchLoading = true;
      ProjectApi.searchProjectByKey({
        searchKey: this.searchKey
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.tableData = response.data.tableData;
            this.total = response.data.total;
            this.searchLoading = false;
          }
        })
        .catch(error => {
          this.searchLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    handleNewProject() {
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      DepartmentApi.getDepartmentIdByPositionId({
        positionId: this.userInfo.positionId
      })
        .then(response => {
          this.projectForm.departmentId = response.data.departmentId;
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
      this.getDepartmentSelect();
      this.modalFormVisible = true;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getProjectTable();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getProjectTable();
    },
    handleEditProject(row) {
      this.getDepartmentSelect();
      this.getIndustryTypeSelect();
      ProjectApi.getProjectDataByProjectId({
        projectId: row.projectId
      }).then(response => {
        if (response.data.responseCode === 200) {
          this.projectForm = response.data.projectData;
        }
      });
      this.modalFormVisible = true;
    },
    resetTableData() {
      this.searchKey = "";
      this.currentPage = 1;
      this.getProjectTable();
    },
    closeModal() {
      this.$refs["projectForm"].resetFields();
      this.projectForm.projectId = "";
      this.projectForm.contactEmail = "";
      this.projectForm.qq = "";
      this.projectForm.enterpriseTel = "";
      this.projectForm.enterpriseLegalPerson = "";
      this.projectForm.registeredCapital = "";
      this.projectForm.enterpriseUrl = "";
      this.projectForm.contactDepartment = "";
      this.projectForm.contactPosition = "";
      this.projectForm.departmentId = "";
      this.modalFormVisible = false;
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
    submitForm() {
      this.$refs["projectForm"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          ProjectApi.updateProjectData({
            projectForm: this.projectForm
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
              this.closeModal();
              this.getProjectTable();
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: error,
                type: "error"
              });
              this.submitLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    getProjectTable() {
      this.tableLoading = true;
      ProjectApi.getProjectTableData({
        currentPage: this.currentPage,
        limit: this.limit
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.tableData = response.data.tableData;
            this.total = response.data.total;
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
    handleProjectDelete(row) {
      ProjectApi.deleteProject({
        projectId: row.projectId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "success"
            });
            this.getProjectTable();
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
    handleHandleProject(row) {
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
      ProjectApi.handleProject({
        projectId: row.projectId,
        user: this.userInfo.username
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "success"
            });
            this.getProjectTable();
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
    this.getProjectTable();
  }
};
</script>

<style scoped></style>
