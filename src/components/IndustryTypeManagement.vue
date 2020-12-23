<template>
  <div style="height: 100%">
    <div style="height: 10px"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        智慧招商
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        基础管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        行业类型管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="padding"></div>
    <div class="title">行业类型管理</div>
    <div style="height: 50px"></div>
    <el-row align="center">
      <el-col :span="4">
        <el-tree
          :data="node"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node }">
            <span
              ><i
                class="el-icon-office-building"
                style="color: #3daff5;margin-right: 10px"
              ></i
              >{{ node.label }}</span
            >
          </span>
        </el-tree>
      </el-col>
      <el-col :span="18">
        <el-form :inline="true" align="right">
          <el-form-item>
            <el-input
              type="text"
              v-model="search"
              placeholder="请输入关键字"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchIndustryType"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="resetLoading"
              @click="resetTable"
            >
              重置
            </el-button>
          </el-form-item>
        </el-form>
        <el-form align="right" :inline="true">
          <el-form-item>
            <el-button type="primary" @click="modalFormVisible = true"
              >新增</el-button
            >
          </el-form-item>
        </el-form>

        <!--  新增/修改模态框  -->

        <el-dialog
          title="行业类型"
          :visible.sync="modalFormVisible"
          v-model="select"
          width="35%"
          show-close
          destroy-on-close
          modal
          :before-close="closeModal"
        >
          <el-form
            :model="modalForm"
            :rules="rules"
            :label-position="labelPosition"
            ref="modalForm"
            inline
          >
            <el-form-item label="行业编号：">
              <el-input
                type="text"
                v-model="modalForm.industryTypeId"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="行业名称：" prop="industryTypeName">
              <el-input type="text" v-model="modalForm.industryTypeName">
              </el-input>
            </el-form-item>
            <el-form-item label="父级类型：">
              <el-select
                placeholder="请选择"
                v-model="select"
                @click.native="getParentNode"
                :filterable="true"
                @change="setFatherNodeId"
                clearable
              >
                <el-option
                  v-for="item in options"
                  :key="item.industryTypeId"
                  :label="item.industryTypeName"
                  :value="item.industryTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="text" v-model="modalForm.remark"> </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="modalFormVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="submitIndustryType('modalForm')"
              :loading="submitLoading"
              >保存</el-button
            >
          </div>
        </el-dialog>

        <!--  新增/修改模态框结束  -->

        <!--  行业类型列表  -->
        <el-table
          ref="table"
          :data="industryTypeData"
          max-height="450px"
          v-loading="loading"
          tooltip-effect="light"
          highlight-current-row
        >
          <el-table-column width="20px"></el-table-column>
          <!--<el-table-column label="id" prop="industryTypeId"></el-table-column>-->
          <el-table-column
            label="行业名称"
            prop="industryTypeName"
          ></el-table-column>
          <el-table-column
            label="父级类型"
            prop="parentTypeName"
          ></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-popconfirm
                title="确认删除该行业类型吗"
                confirm-button-text="确认"
                confirm-button-type="primary"
                cancel-button-text="取消"
                cancel-button-type="default"
                size="mini"
                @confirm="deleteIndustryType(scope.row)"
              >
                <el-button slot="reference">
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-popconfirm>
              <el-button
                @click="updateIndustryType(scope.row)"
                style="margin-left: 5px;"
              >
                <i class="el-icon-edit"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--  分页  -->
        <div style="height: 30px;width: 100%"></div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          layout="total, sizes , prev , pager , next , jumper"
          :total="total"
        >
        </el-pagination>

        <!-- 分页结束  -->
        <!--  行业类型列表结束  -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import IndustryTypeApi from "@/api/IndustryTypeApi";

export default {
  name: "IndustryTypeManagement",
  inject: ["reload"],
  data() {
    return {
      loading: true,
      defaultProps: {
        id: "id",
        label: "industryTypeName",
        children: "nodes"
      },
      node: [
        {
          label: "暂无数据"
        }
      ],
      industryTypeData: [],
      search: " ",
      modalForm: {
        industryTypeId: "",
        industryTypeName: "",
        fatherNodeId: "",
        remark: ""
      },
      modalFormVisible: false,
      currentPage: 1,
      limit: 10,
      labelPosition: "left",
      options: [],
      selectLoading: true,
      select: "",
      radio: false,
      rules: {
        industryTypeName: [
          { required: true, message: "请输入行业名称", trigger: "blur" }
        ]
      },
      submitLoading: false,
      total: 0,
      resetLoading: false
    };
  },
  methods: {
    resetTable() {
      this.resetLoading = true;
      this.getIndustryTypeData();
      this.getDataTotal();
      this.resetLoading = false;
    },
    searchIndustryType() {
      if (this.search === "") {
        this.$message({
          showClose: true,
          message: "请输入关键字",
          type: "error"
        });
        return;
      }
      this.loading = true;
      this.currentPage = 1;
      IndustryTypeApi.getIndustryTypeDataByKey({
        key: this.search,
        currentPage: this.currentPage,
        limit: this.limit
      })
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.industryTypeData = response.data.industryTypeData;
              this.loading = false;
              break;
            case 400:
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: "error"
              });
              this.loading = false;
              break;
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
          this.loading = false;
        });
    },
    updateIndustryType(row) {
      console.log(row);
      console.log(this.industryTypeData);
      this.modalForm.industryTypeId = row.industryTypeId;
      this.modalForm.industryTypeName = row.industryTypeName;
      this.modalForm.fatherNodeId = row.fatherNodeId;
      this.modalForm.remark = row.remark;
      this.modalFormVisible = true;
    },
    deleteIndustryType(rows) {
      console.log(rows);
      IndustryTypeApi.deleteIndustryTypeById({
        industryTypeId: rows.industryTypeId
      }).then(response => {
        let code = response.data.responseCode;
        switch (code) {
          case 200:
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "success"
            });
            break;
          case 400:
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
            break;
        }
        this.getIndustryTypeData();
        this.getIndustryTypeTree();
        this.getDataTotal();
      });
    },
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.limit = val;
      this.getIndustryTypeData();
    },
    handleCurrentChange(val) {
      console.log(`当前页：${val}`);
      this.currentPage = val;
      this.getIndustryTypeData();
    },
    handleNodeClick(e) {},

    getIndustryTypeData() {
      IndustryTypeApi.getIndustryTypes({
        currentPage: this.currentPage,
        limit: this.limit
      })
        .then(response => {
          this.industryTypeData = response.data.industryTypeData;
          this.loading = false;
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    getIndustryTypeTree() {
      IndustryTypeApi.getIndustryTypeTree()
        .then(response => {
          this.node = response.data.node;
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    getParentNode() {
      IndustryTypeApi.getParentTypeData()
        .then(response => {
          console.log(response.data);
          this.options = response.data.parentNodes;
          this.selectLoading = false;
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    setFatherNodeId(val) {
      this.modalForm.fatherNodeId = val;
    },
    submitIndustryType(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          IndustryTypeApi.postNewIndustryTypeData({
            industryTypeId: this.modalForm.industryTypeId,
            industryTypeName: this.modalForm.industryTypeName,
            fatherNodeId: this.modalForm.fatherNodeId,
            remark: this.modalForm.remark
          }).then(response => {
            let code = response.data.responseCode;
            switch (code) {
              case 200:
                this.$message({
                  showClose: true,
                  message: response.data.msg,
                  type: "success"
                });
                break;
              case 400:
                this.$message({
                  showClose: true,
                  message: response.data.msg,
                  type: "error"
                });
                break;
            }
            this.submitLoading = false;
            this.modalFormVisible = false;
            this.getIndustryTypeData();
            this.getIndustryTypeTree();
            this.getDataTotal();
          });
        } else {
          return false;
        }
      });
    },
    closeModal() {
      this.modalForm.industryTypeId = "";
      this.modalForm.industryTypeName = "";
      this.modalForm.fatherNodeId = "";
      this.modalForm.remark = "";
      this.modalFormVisible = false;
    },
    getDataTotal() {
      IndustryTypeApi.getIndustryTypeDataTotalCount().then(response => {
        let code = response.data.responseCode;
        switch (code) {
          case 200:
            this.total = response.data.total;
            break;
          case 400:
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
            break;
        }
      });
    }
  },
  mounted() {
    this.getIndustryTypeData();
    this.getDataTotal();
    this.getIndustryTypeTree();
  },

  created() {
    /**
     * 装配树形结构
     * */
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        //获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          const CONDITION = this.scrollHeight <= this.clientHeight;
          if (CONDITION) {
            binding.value();
          }
        });
      }
    }
  }
};
</script>

<style scoped></style>
<style>
.el-tree-node__label {
  padding: 0 20px;
  margin: 10px 0;
}
.title {
  text-align: center;
  width: 100%;
  font-family: "PingFang SC";
  font-size: x-large;
}
.padding {
  width: 100%;
  height: 5%;
}
</style>
