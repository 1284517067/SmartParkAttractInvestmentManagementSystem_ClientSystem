<template>
  <div class="full-height full-width">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        智慧招商
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        项目中心
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        租赁申请
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
      <div class="float-right">
        <el-button type="primary" @click="handleNewContract">新增</el-button>
      </div>
      <div class="title-padding-bottom"></div>
      <el-tabs v-model="activeName" @tab-click="handleTabChange">
        <el-tab-pane label="待发" name="待发"></el-tab-pane>
        <el-tab-pane label="已发" name="已发"></el-tab-pane>
      </el-tabs>
      <el-table :data="tableData" v-loading="tableLoading" max-height="500">
        <el-table-column label="合同名称" prop="formName"></el-table-column>
        <el-table-column label="租户" prop="enterpriseName"></el-table-column>
        <el-table-column label="签订日期" prop="signDate"></el-table-column>
        <el-table-column label="起租日期" prop="startDate"></el-table-column>
        <el-table-column label="止租日期" prop="expiryDate"></el-table-column>
        <el-table-column label="合同状态" prop="status"></el-table-column>
        <el-table-column label="登记人" prop="applicant"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <ApprovalProcessStep
              v-if="activeName === '已发'"
              :contract-type="contractType"
              :form-id="scope.row.formId"
            ></ApprovalProcessStep>
            <el-tooltip
              :content="activeName === '待发' ? '编辑' : '查看'"
              effect="dark"
              placement="top"
            >
              <el-button
                type="text"
                @click="handleEditLeaseContract(scope.row.formId)"
              >
                <i
                  :class="
                    activeName === '待发' ? 'el-icon-edit' : 'el-icon-view'
                  "
                ></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              v-if="activeName === '待发'"
              content="删除"
              placement="top"
              effect="dark"
            >
              <el-popconfirm
                title="确认删除该意向房间吗？"
                cancel-button-text="取消"
                cancel-button-type="default"
                confirm-button-type="primary"
                confirm-button-text="确定"
                @confirm="handleDeleteLeaseContact(scope.row.formId)"
              >
                <el-button type="text" slot="reference">
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="title-padding-bottom"></div>
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
    <el-dialog
      title="租赁申请"
      width="80%"
      show-close
      destroy-on-close
      modal
      :visible.sync="modalFormVisible"
      :before-close="closeModal"
    >
      <el-row>
        <LeaseContractComponent
          :active-name="activeName"
          :form-id="formId"
          v-if="modalFormVisible"
          :close-modal="closeModal"
        ></LeaseContractComponent>
        <ApprovalOpinions
          v-if="modalFormVisible"
          contract-type="租赁合同"
          :id="formId"
          :form-status="activeName"
          business-type="新签"
        ></ApprovalOpinions>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import ApprovalProcessStep from "@/components/approvalFormComponents/ApprovalProcessStep";
import LeaseContractApi from "@/api/LeaseContractApi";
import ApprovalOpinions from "@/components/ApprovalOpinions";
import LeaseContractComponent from "@/components/approvalFormComponents/LeaseContractComponent";
export default {
  name: "LeaseContractApplication",
  components: { LeaseContractComponent, ApprovalOpinions, ApprovalProcessStep },
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      activeName: "待发",
      tableData: [],
      tableLoading: false,
      contractType: "租赁合同",
      limit: 10,
      currentPage: 1,
      total: 0,
      modalFormVisible: false,
      formId: ""
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
      LeaseContractApi.searchLeaseContractByKey({
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
          this.tableLoading = false;
          this.searchLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    resetTableData() {
      this.searchKey = "";
      this.getTableData();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    handleNewContract() {
      this.modalFormVisible = true;
    },
    handleTabChange() {
      this.getTableData();
    },
    getTableData() {
      this.tableLoading = true;
      LeaseContractApi.getLeaseContractTableData({
        limit: this.limit,
        currentPage: this.currentPage,
        status: this.activeName
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
    handleEditLeaseContract(formId) {
      this.formId = formId;
      this.modalFormVisible = true;
    },
    handleDeleteLeaseContact(formId) {
      LeaseContractApi.deleteLeaseContract({
        formId: formId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "success"
            });
          }
          this.getTableData();
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
          this.getTableData();
        });
    },
    closeModal() {
      this.formId = "";
      this.modalFormVisible = false;
    }
  },
  mounted() {
    this.getTableData();
  }
};
</script>

<style scoped></style>
