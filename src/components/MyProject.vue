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
        我的项目
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title-padding-bottom"></div>

    <!-- 新增/更新模态框 -->
    <el-dialog
      title="我的项目"
      :visible.sync="modalFormVisible"
      width="80%"
      show-close
      destroy-on-close
      modal
      :before-close="closeModal"
    >
      <el-row align="center" :gutter="40">
        <el-form :model="projectForm" ref="projectForm">
          <el-col :span="8">
            <el-form-item label="项目ID">
              <el-input
                type="text"
                v-model="projectForm.projectId"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业名称">
              <el-input
                type="text"
                v-model="projectForm.enterpriseName"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业所属地区">
              <el-input
                type="text"
                v-model="projectForm.enterpriseArea"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源类型">
              <el-select
                v-model="projectForm.source"
                placeholder="请选择来源类型"
                class="full-width"
                readonly
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
                v-model="projectForm.industryTypeId"
                @focus="getIndustryTypeSelect"
                class="full-width"
                readonly
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
            <el-form-item label="联系人">
              <el-input
                type="text"
                v-model="projectForm.contact"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人电话">
              <el-input
                type="text"
                v-model="projectForm.contactTel"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人部门">
              <el-input
                type="text"
                v-model="projectForm.contactDepartment"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人职位">
              <el-input
                type="text"
                v-model="projectForm.contactPosition"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系QQ">
              <el-input
                type="text"
                v-model="projectForm.qq"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系邮箱">
              <el-input
                type="email"
                v-model="projectForm.contactEmail"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业电话">
              <el-input
                type="text"
                v-model="projectForm.enterpriseTel"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业网址">
              <el-input
                type="text"
                v-model="projectForm.enterpriseUrl"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业法人">
              <el-input
                type="text"
                v-model="projectForm.enterpriseLegalPerson"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册时间">
              <el-date-picker
                v-model="projectForm.registrationTime"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                readonly
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册资本（万）">
              <el-input
                type="text"
                v-model.number="projectForm.registeredCapital"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属部门">
              <el-select
                v-model="projectForm.departmentId"
                @focus="getDepartmentSelect"
                class="full-width"
                readonly
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
    </el-dialog>
    <!-- 新增/更新模态框结束 -->

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
        <el-table-column label="项目状态" prop="status"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip placement="top" content="查看" effect="dark">
              <el-button type="text" @click="getProjectDetail(scope.row)">
                <i class="el-icon-view"></i>
              </el-button>
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
import ProjectApi from "@/api/ProjectApi";
import IndustryTypeApi from "@/api/IndustryTypeApi";
import DepartmentApi from "@/api/DepartmentApi";

export default {
  name: "MyProject",
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      tableData: [],
      tableLoading: false,
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
      industryTypeList: [],
      departments: []
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
      this.tableLoading = true;
      let user = JSON.parse(localStorage.getItem("userInfo"));
      ProjectApi.getPersonProjectTableByKey({
        searchKey: this.searchKey,
        username: user.username
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.tableData = response.data.tableData;
            this.total = response.data.total;
          }
          this.tableLoading = false;
          this.searchLoading = false;
        })
        .catch(error => {
          this.tableLoading = false;
          this.searchLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getPersonProjectTable();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPersonProjectTable();
    },
    resetTableData() {
      this.searchKey = "";
      this.getPersonProjectTable();
    },
    getProjectDetail(row) {
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
    getPersonProjectTable() {
      this.tableLoading = true;
      let user = JSON.parse(localStorage.getItem("userInfo"));
      ProjectApi.getPersonProjectTableData({
        username: user.username,
        limit: this.limit,
        currentPage: this.currentPage
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
    closeModal() {
      Object.keys(this.projectForm).map(key => {
        this.projectForm[key] = "";
      });
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
    }
  },
  mounted() {
    this.getPersonProjectTable();
  }
};
</script>

<style scoped></style>
