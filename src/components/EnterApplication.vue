<template>
  <div class="full-width full-height">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        智慧招商
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        项目中心
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        入驻管理
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
            @click="searchByKey"
            :loading="searchLoading"
          >
            查询
          </el-button>
          <el-button type="primary" @click="resetTable">
            重置
          </el-button>
        </el-col>
      </el-row>
      <div class="float-right">
        <el-button type="primary" @click="handleNewEnterApplication"
          >新增</el-button
        >
      </div>
      <div class="title-padding-bottom"></div>
      <el-tabs v-model="activeName" @tab-click="handleTabChange">
        <el-tab-pane label="待发" name="待发"></el-tab-pane>
        <el-tab-pane label="已发" name="已发"></el-tab-pane>
      </el-tabs>
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column
          label="客户名称"
          prop="enterpriseName"
        ></el-table-column>
        <el-table-column label="入驻时间" prop="enterTime"> </el-table-column>
        <el-table-column label="负责人" prop="principal"></el-table-column>
        <el-table-column
          label="审批结果"
          prop="approvalStatus"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <ApprovalProcessStep
              v-if="activeName === '已发'"
              :contract-type="contractType"
              :form-id="scope.row.formId"
            >
            </ApprovalProcessStep>
            <el-tooltip
              :content="activeName === '待发' ? '编辑' : '查看'"
              effect="dark"
              placement="top"
            >
              <el-button
                type="text"
                @click="handleEditEnterApplication(scope.row.formId)"
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
                title="确认删除该记录吗？"
                cancel-button-text="取消"
                cancel-button-type="default"
                confirm-button-type="primary"
                confirm-button-text="确定"
                @confirm="handleDeleteEnterApplication(scope.row.formId)"
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
      title="入驻申请"
      width="80%"
      show-close
      destroy-on-close
      modal
      :visible.sync="modalFormVisible"
      :before-close="closeModal"
    >
      <el-row>
        <EnterApplicationComponent
          v-if="modalFormVisible"
          :form-id="formId"
          :close-modal="closeModal"
          :active-name="activeName"
        >
        </EnterApplicationComponent>
        <ApprovalOpinions
          v-if="modalFormVisible"
          contract-type="入驻申请"
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
import EnterApplicationApi from "@/api/EnterApplicationApi";
import ApprovalOpinions from "@/components/ApprovalOpinions";
import EnterApplicationComponent from "@/components/approvalFormComponents/EnterApplicationComponent";
export default {
  name: "EnterApplication",
  components: {
    EnterApplicationComponent,
    ApprovalOpinions,
    ApprovalProcessStep
  },
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      total: 0,
      currentPage: 1,
      limit: 10,
      tableData: [],
      tableLoading: false,
      modalFormVisible: false,
      activeName: "待发",
      contractType: "入驻申请",
      formId: ""
    };
  },
  methods: {
    searchByKey() {},
    resetTable() {
      this.searchKey = "";
      this.getTableData();
    },
    handleTabChange(val) {
      this.getTableData();
    },
    getTableData() {
      this.tableLoading = true;
      EnterApplicationApi.getEnterApplicationTableData({
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
    handleNewEnterApplication() {
      this.modalFormVisible = true;
    },
    handleEditEnterApplication(formId) {
      this.modalFormVisible = true;
      this.formId = formId;
    },
    handleDeleteEnterApplication(formId) {},
    handleSizeChange(val) {
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    closeModal() {
      this.formId = "";
      this.modalFormVisible = false;
      this.getTableData();
    }
  },
  mounted() {
    this.getTableData();
  }
};
</script>

<style scoped></style>
