<template>
  <div style="height: 100%">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        基础管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        职位管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title-padding-bottom"></div>
    <el-row align="center">
      <el-col :span="6">
        <el-input v-model="searchKey" placeholder="请输入关键字"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" :loading="searchLoading" @click="searchByKey">
          查询
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" :loading="resetLoading" @click="resetTable">
          重置
        </el-button>
      </el-col>
    </el-row>
    <div class="title-padding-bottom"></div>
    <el-dialog
      title="部门职位"
      :visible.sync="modalFormVisible"
      width="35%"
      show-close
      destroy-on-close
      modal
      :before-close="closeModal"
    >
      <el-form
        :model="dataForm"
        ref="dataForm"
        label-position="left"
        :rules="rules"
        inline
      >
        <template v-if="modelType === 'position'">
          <el-form-item label="职位编号：">
            <el-input
              type="text"
              v-model="dataForm.positionId"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="职位名称：" prop="positionName">
            <el-input type="text" v-model="dataForm.positionName"></el-input>
          </el-form-item>
          <el-form-item label="所属部门：" prop="departmentName">
            <el-select
              placeholder="请选择所属部门"
              v-model="dataForm.departmentName"
              @focus="getDepartmentSelect"
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in departments"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentName"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-else-if="modelType === 'department'">
          <el-form-item label="部门Id：">
            <el-input
              v-model="dataForm.departmentId"
              type="text"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="部门名称：" prop="departmentName">
            <el-input v-model="dataForm.departmentName" type="text"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer">
        <el-button>取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submitForm('dataForm')"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <div class="content-block">
      <el-row align="center">
        <el-col :span="3">
          <el-tree
            :data="departmentTree"
            :props="defaultProps"
            :loading="treeLoading"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-col>
        <el-col :span="18" :offset="2">
          <el-button
            type="primary"
            class="float-right"
            @click="
              modalFormVisible = true;
              submitType = '新增';
            "
            >新增</el-button
          >
          <el-tabs
            v-model="modelType"
            @tab-click="handleTabClick"
            style="margin-top: 50px"
          >
            <el-tab-pane label="职位" name="position"></el-tab-pane>
            <el-tab-pane label="部门" name="department"></el-tab-pane>
          </el-tabs>
          <el-table
            :data="tableData"
            height="500"
            v-loading="tableLoading"
            :key="Math.random()"
          >
            <template v-if="modelType === 'position'">
              <el-table-column
                prop="positionId"
                label="职位Id"
                column-key="1"
              ></el-table-column>
              <el-table-column
                prop="positionName"
                label="职位名称"
                column-key="2"
              >
              </el-table-column>
              <el-table-column
                prop="departmentName"
                label="所属部门"
                column-key="3"
              >
              </el-table-column>
            </template>
            <template v-else-if="modelType === 'department'">
              <el-table-column
                prop="departmentId"
                label="部门Id"
                column-key="4"
              ></el-table-column>
              <el-table-column
                prop="departmentName"
                label="部门名称"
                column-key="5"
              ></el-table-column>
            </template>
            <el-table-column label="操作" column-key="6">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="editData(scope.row)">
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-popconfirm
                  title="确认删除该记录吗？"
                  cancel-button-text="取消"
                  cancel-button-type="default"
                  confirm-button-type="warning"
                  confirm-button-text="确定"
                  @confirm="deleteData(scope.row)"
                >
                  <el-button size="mini" type="text" slot="reference">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
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
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import DepartmentApi from "@/api/DepartmentApi";
import PositionApi from "@/api/PositionApi";

export default {
  name: "PositionManagement",
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      treeLoading: false,
      departmentTree: [],
      defaultProps: {
        label: "label",
        children: "children"
      },
      tableData: [],
      tableLoading: true,
      currentPage: 1,
      limit: 10,
      total: 0,
      modalFormVisible: false,
      modelType: "position",
      dataForm: {
        positionId: "",
        positionName: "",
        departmentId: "",
        departmentName: ""
      },
      departments: [
        {
          departmentId: "",
          departmentName: ""
        }
      ],
      submitLoading: false,
      submitType: "",
      rules: {
        positionName: [
          { required: true, message: "请输入职位名称", trigger: "blur" }
        ],
        departmentName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
          { required: true, message: "请选择所属部门", trigger: "change" }
        ]
      },
      resetLoading: false
    };
  },
  methods: {
    resetTable() {
      this.resetLoading = true;
      this.mountTableData();
      this.resetLoading = false;
    },
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
      switch (this.modelType) {
        case "position":
          PositionApi.getPositionDataByKey({
            searchKey: this.searchKey
          })
            .then(response => {
              let code = response.data.responseCode;
              switch (code) {
                case 200:
                  this.tableData = response.data.tableData;
                  this.total = response.data.dataTotal;
                  break;
                case 400:
                  break;
              }
              this.searchLoading = false;
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: error,
                type: "error"
              });
              this.searchLoading = false;
            });
          break;
        case "department":
          DepartmentApi.getDepartmentDataByKey({
            searchKey: this.searchKey
          })
            .then(response => {
              let code = response.data.responseCode;
              switch (code) {
                case 200:
                  this.tableData = response.data.tableData;
                  this.total = response.data.dataTotal;
                  break;
                case 400:
                  break;
              }
              this.searchLoading = false;
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: error,
                type: "error"
              });
              this.searchLoading = false;
            });
          break;
      }
    },
    handleNodeClick() {},
    handleTabClick() {
      this.mountTableData();
    },
    getDepartmentTree() {
      this.treeLoading = true;
      DepartmentApi.getDepartmentTreeData()
        .then(response => {
          let code = response.data.responseCode;
          let treeData = [];
          switch (code) {
            case 200:
              this.treeLoading = false;
              treeData = response.data.departmentTree;
              treeData.forEach(item => {
                item.label = item.departmentName;
                item.positions.forEach(node => {
                  node.label = node.positionName;
                });
                item.children = item.positions;
              });
              this.departmentTree = treeData;
              break;
            case 400:
              this.treeLoading = false;
              break;
          }
        })
        .catch(error => {
          this.treeLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    handleSelectChange(val) {
      let data = this.departments.filter(item => {
        return (item.departmentName = val);
      });
      this.dataForm.departmentId = data[0].departmentId;
    },

    editData(row) {
      console.log(row);
      this.submitType = "更新";
      switch (this.modelType) {
        case "position":
          this.dataForm.positionId = row.positionId;
          this.dataForm.positionName = row.positionName;
          this.dataForm.departmentId = row.departmentId;
          this.dataForm.departmentName = row.departmentName;
          break;
        case "department":
          this.dataForm.departmentId = row.departmentId;
          this.dataForm.departmentName = row.departmentName;
          break;
      }
      this.modalFormVisible = true;
    },
    deleteData(row) {
      switch (this.modelType) {
        case "position":
          PositionApi.deletePositionByPositionId({
            positionId: row.positionId
          })
            .then(response => {
              let code = response.data.responseCode;
              switch (code) {
                case 200:
                  this.$message({
                    showClose: true,
                    message: response.data.msg,
                    type: "success"
                  });
                  this.mountTableData();
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
              this.deleteLoading = false;
            });
          break;
        case "department":
          DepartmentApi.deleteDepartmentByDepartmentId({
            departmentId: row.departmentId
          })
            .then(response => {
              let code = response.data.responseCode;
              switch (code) {
                case 200:
                  this.$message({
                    showClose: true,
                    message: response.data.msg,
                    type: "success"
                  });
                  this.mountTableData();
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
              this.deleteLoading = false;
            });
          break;
      }
    },
    getPositionTable() {
      this.tableLoading = true;
      PositionApi.getPositionTableData({
        currentPage: this.currentPage,
        limit: this.limit
      })
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.tableLoading = false;
              this.tableData = response.data.positionTableData;
              break;
            case 400:
              this.tableLoading = false;
              break;
          }
        })
        .catch(error => {
          this.treeLoading = false;
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
    clearDepartmentSelect() {
      this.dataForm.departmentId = "";
      this.dataForm.departmentName = "";
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getPositionTable();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPositionTable();
    },
    getPositionTotal() {
      PositionApi.getPositionTotalData()
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.total = response.data.dataTotal;
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
    getDepartmentTable() {
      this.tableLoading = true;
      DepartmentApi.getDepartmentTableData({
        currentPage: this.currentPage,
        limit: this.limit
      })
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.tableData = response.data.positionArrayData;
              this.tableLoading = false;
              break;
            case 400:
              this.tableLoading = false;
              break;
          }
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          switch (this.modelType) {
            case "position":
              PositionApi.createPosition({
                positionId: this.dataForm.positionId,
                positionName: this.dataForm.positionName,
                departmentId: this.dataForm.departmentId,
                submitType: this.submitType
              })
                .then(response => {
                  let code = response.data.responseCode;
                  switch (code) {
                    case 200:
                      this.$message({
                        showClose: true,
                        message: response.data.msg,
                        type: "success"
                      });
                      this.submitLoading = false;
                      this.closeModal();
                      this.mountTableData();
                      break;
                    case 400:
                      this.submitLoading = false;
                      break;
                  }
                })
                .catch(error => {
                  this.submitLoading = false;
                  this.$message({
                    showClose: true,
                    message: error,
                    type: "error"
                  });
                });

              break;
            case "department":
              DepartmentApi.createDepartment({
                departmentId: this.dataForm.departmentId,
                departmentName: this.dataForm.departmentName,
                submitType: this.submitType
              })
                .then(response => {
                  let code = response.data.responseCode;
                  switch (code) {
                    case 200:
                      this.$message({
                        showClose: true,
                        message: response.data.msg,
                        type: "success"
                      });
                      this.submitLoading = false;
                      this.closeModal();
                      this.mountTableData();
                      break;
                    case 400:
                      this.submitLoading = false;
                      break;
                  }
                })
                .catch(error => {
                  this.submitLoading = false;
                  this.$message({
                    showClose: true,
                    message: error,
                    type: "error"
                  });
                });
              break;
          }
          this.modalFormVisible = false;
        } else {
          return false;
        }
      });
    },
    getDepartmentTotal() {
      DepartmentApi.getDepartmentTotalData()
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.total = response.data.dataTotal;
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
    closeModal() {
      this.dataForm.departmentName = "";
      this.dataForm.departmentId = "";
      this.dataForm.positionName = "";
      this.dataForm.positionId = "";
      this.modalFormVisible = false;
    },
    mountTableData() {
      switch (this.modelType) {
        case "position":
          this.getPositionTable();
          this.getPositionTotal();
          break;
        case "department":
          this.getDepartmentTable();
          this.getDepartmentTotal();
          break;
      }
    }
  },
  mounted() {
    this.getDepartmentTree();
    this.mountTableData();
  },
  created() {}
};
</script>

<style scoped></style>
