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
        意向协议
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 新增/更新意向协议 -->
    <el-dialog
      title="意向协议"
      :visible.sync="modalFormVisible"
      width="80%"
      show-close
      destroy-on-close
      modal
      :before-close="closeModal"
    >
      <el-row>
        <IntentionAgreementComponent
          v-if="modalFormVisible"
          :active-name="activeName"
          :form-id="formId"
          :close-modal="closeModal"
          ref="intentionAgreementComponent"
        ></IntentionAgreementComponent>
        <div class="top-padding"></div>
        <ApprovalOpinions
          contract-type="意向协议"
          v-if="modalFormVisible"
          :id="formId"
          :form-status="activeName"
          business-type="新签"
        ></ApprovalOpinions>
      </el-row>
    </el-dialog>
    <!-- 新增/更新意向协议结束 -->
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
          <el-button type="primary" @click="searchByKey">查询</el-button>
          <el-button type="primary" @click="resetTableData">重置</el-button>
        </el-col>
      </el-row>
      <div class="float-right">
        <el-button type="primary" @click="handleNew">新增</el-button>
      </div>
      <div class="title-padding-bottom"></div>
      <el-tabs v-model="activeName" @tab-click="handleTabChange">
        <el-tab-pane label="待发" name="待发"></el-tab-pane>
        <el-tab-pane label="已发" name="已发"></el-tab-pane>
      </el-tabs>
      <el-table :data="tableData" v-loading="tableLoading" max-height="500">
        <el-table-column
          label="企业名称"
          prop="enterpriseName"
        ></el-table-column>
        <el-table-column label="申请时间" prop="applyDate"></el-table-column>
        <el-table-column label="联系人员" prop="contact"></el-table-column>
        <el-table-column label="联系电话" prop="contactTel"></el-table-column>
        <el-table-column
          label="房间最晚保留日期"
          prop="deadline"
        ></el-table-column>
        <el-table-column
          label="申请状态"
          prop="approvalStatus"
        ></el-table-column>
        <el-table-column label="操作">
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
              <el-button type="text" @click="handleEdit(scope.row)">
                <i
                  :class="
                    activeName === '待发' ? 'el-icon-edit' : 'el-icon-view'
                  "
                ></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              content="删除"
              effect="dark"
              placement="top"
              v-if="activeName === '待发'"
            >
              <el-popconfirm
                title="确认删除该意向房间吗？"
                cancel-button-text="取消"
                cancel-button-type="default"
                confirm-button-type="primary"
                confirm-button-text="确定"
                @confirm="deleteIntentionAgreementForm(scope.row.formId)"
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
  </div>
</template>

<script>
import IntentionAgreementApi from "@/api/IntentionAgreementApi";
import ChangeEnterprise from "@/components/ChangeEnterprise";
import common from "@/assets/common";
import { formatDate } from "@/assets/date";
import IntentionAgreementComponent from "@/components/approvalFormComponents/IntentionAgreementComponent";
import ApprovalProcessStep from "@/components/approvalFormComponents/ApprovalProcessStep";
import ApprovalOpinions from "@/components/ApprovalOpinions";

export default {
  name: "IntentionAgreementManagement",
  components: {
    ApprovalOpinions,
    ApprovalProcessStep,
    IntentionAgreementComponent
  },
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      tableData: [],
      tableLoading: false,
      modalFormVisible: false,
      enterpriseModalFormVisible: false,
      limit: 10,
      currentPage: 1,
      total: 0,
      activeName: "待发",
      formId: "",
      contractType: "意向协议"
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
      IntentionAgreementApi.searchByKey({
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
    handleTabChange() {
      this.getTableData();
    },
    handleEdit(row) {
      this.formId = row.formId;
      this.modalFormVisible = true;
    },
    handleNew() {
      this.modalFormVisible = true;
    },
    handleEnterpriseChange(val) {
      this.intentionAgreementForm.enterpriseName = val.enterpriseName;
      this.intentionAgreementForm.enterpriseId = val.enterpriseId;
      this.intentionAgreementForm.formName =
        formatDate(new Date(), "yyyy-MM-dd") +
        "-" +
        this.intentionAgreementForm.enterpriseName +
        "-意向协议";
      this.enterpriseModalFormVisible = false;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    getTableData() {
      this.tableLoading = true;
      IntentionAgreementApi.getIntentionAgreementTableData({
        currentPage: this.currentPage,
        limit: this.limit,
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
    deleteIntentionAgreementForm(formId) {
      IntentionAgreementApi.deleteIntentionAgreement({
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
          this.getTableData();
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    closeModal() {
      this.getTableData();
      this.formId = "";
      this.modalFormVisible = false;
    },
    resetTableData() {
      this.searchKey = "";
      this.currentPage = 1;
      this.getTableData();
    }
  },
  mounted() {
    this.getTableData();
  }
};
</script>

<style scoped></style>
