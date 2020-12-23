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
        项目回收站
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title-padding-bottom"></div>
    <div class="content-block">
      <el-row>
        <el-col :span="4">
          <el-input
            type="text"
            v-model="searchKey"
            placeholder="请输入关键字"
          ></el-input>
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
      <el-table max-height="600" v-loading="tableLoading" :data="tableData">
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
              content="恢复项目"
              placement="top"
            >
              <el-popconfirm
                title="确认恢复该项目吗"
                confirm-button-type="primary"
                confirm-button-text="确定"
                cancel-button-text="取消"
                cancel-button-type="default"
                @confirm="recoverProject(scope.row)"
              >
                <el-button type="text" slot="reference">
                  <i class="el-icon-top-right"></i>
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
import ProjectApi from "@/api/ProjectApi";

export default {
  name: "ProjectRecycleBin",
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      tableData: [],
      currentPage: 1,
      limit: 10,
      tableLoading: false,
      total: 0
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
      ProjectApi.searchDeletedProjectByKey({
        searchKey: this.searchKey
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.tableData = response.data.tableData;
            this.total = response.data.total;
          }
          this.searchLoading = false;
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
    recoverProject(row) {
      ProjectApi.recoverProjectData({
        projectId: row.projectId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "success"
            });
          }
          this.getDeletedProjectList();
        })
        .catch(error => {
          this.getDeletedProjectList();
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    getDeletedProjectList() {
      this.tableLoading = true;
      ProjectApi.getDeletedProjectListData({
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
    handleSizeChange(val) {
      this.limit = val;
      this.getDeletedProjectList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDeletedProjectList();
    },
    resetTableData() {
      this.searchKey = "";
      this.currentPage = 1;
      this.getDeletedProjectList();
    }
  },
  mounted() {
    this.getDeletedProjectList();
  }
};
</script>

<style scoped></style>
