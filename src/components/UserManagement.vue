<template>
  <div style="height: 100%">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        系统管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        用户管理
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
      title="用户信息"
      :visible.sync="modalFormVisible"
      width="35%"
      show-close
      destroy-on-close
      :before-close="closeModal"
      modal
    >
      <el-form
        :model="userForm"
        ref="userForm"
        label-position="left"
        :rules="rules"
        inline
      >
        <el-form-item label="用户名：" prop="username">
          <el-input type="text" v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="账号等级：">
          <el-input-number
            v-model="userForm.accountLevel"
            controls-position="right"
            @change="handleAccountLevelChange"
            :min="1"
            :max="2"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="部门职位：" prop="positionId">
          <el-cascader
            v-model="userForm.positionId"
            :options="positionArr"
            @focus="getDepartmentList"
            @change="handleUserPositionChange"
            v-loading="cascaderLoading"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择账号状态">
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
            <el-option label="锁定" value="锁定"></el-option>
            <el-option label="注销" value="注销"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button>取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submitForm('userForm')"
          >保存</el-button
        >
      </div>
    </el-dialog>

    <div class="content-block">
      <el-button
        type="primary"
        class="float-right"
        @click="
          modalFormVisible = true;
          submitType = '新增';
        "
        >新增</el-button
      >
      <div class="title-padding-bottom"></div>
      <el-table :data="userTable" max-height="500" v-loading="tableLoading">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="positionName" label="部门职位"></el-table-column>
        <el-table-column prop="accountLevel" label="账号等级"></el-table-column>
        <el-table-column prop="status" label="账号状态">
          <template slot-scope="scope">
            <el-tag :type="getTagType(scope.row.status)" disable-transitions>
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                class="table-button"
                type="text"
                @click="handleUserEdit(scope.row)"
              >
                <i class="el-icon-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.status === '禁用' ? '启用账号' : '禁用账号'"
              placement="top"
            >
              <el-button
                class="table-button"
                @click="handleUserSwitch(scope.row)"
                type="text"
              >
                <i :class="switchIconClass(scope.row.status)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.status === '锁定' ? '启用账号' : '锁定账号'"
              placement="top"
            >
              <el-button
                type="text"
                class="table-button"
                @click="handleUserLock(scope.row)"
              >
                <i :class="switchIconLock(scope.row.status)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="注销账号"
              placement="top"
            >
              <el-popconfirm
                class="table-button"
                title="确认注销该账号吗"
                cancel-button-type="default"
                cancel-button-text="取消"
                confirm-button-text="确定"
                confirm-button-type="primary"
                @confirm="handleUserDelete(scope.row)"
              >
                <el-button type="text" slot="reference">
                  <i class="el-icon-delete-solid"></i>
                </el-button>
              </el-popconfirm>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="重置密码"
              placement="top"
            >
              <el-popconfirm
                class="table-button"
                title="确认重置该账号的密码吗"
                cancel-button-type="default"
                cancel-button-text="取消"
                confirm-button-text="确定"
                confirm-button-type="primary"
                @confirm="handleUserRefreshPassword(scope.row)"
              >
                <el-button type="text" slot="reference">
                  <i class="el-icon-refresh-right"></i>
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
import UserApi from "@/api/UserApi";
import DepartmentApi from "@/api/DepartmentApi";

export default {
  name: "UserManagement",
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      userTable: [
        {
          username: "",
          positionId: [],
          positionName: "",
          departmentName: "",
          accountLevel: "",
          status: ""
        }
      ],
      tableLoading: true,
      limit: 10,
      currentPage: 1,
      total: 0,
      userForm: {
        username: "",
        positionId: [],
        positionName: "",
        accountLevel: 1,
        status: ""
      },
      positionArr: [
        {
          label: "",
          value: "",
          children: []
        }
      ],
      modalFormVisible: false,
      cascaderLoading: false,
      submitType: "",
      submitLoading: false,
      resetLoading: false,
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, message: "用户名长度不能少于3个字符", trigger: "blur" },
          { max: 20, message: "用户名长度过长", trigger: "blur" }
        ],
        positionId: [
          { required: true, message: "请选择部门职位", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择账号状态", trigger: "change" }
        ]
      },
      departmentId: ""
    };
  },
  methods: {
    resetTable() {
      this.resetLoading = true;
      this.getUserTableData();
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
      UserApi.searchUserByKey({
        searchKey: this.searchKey
      })
        .then(response => {
          let code = response.data.responseCode;
          let userData;
          switch (code) {
            case 200:
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: "success"
              });
              userData = response.data.userData;
              userData.forEach(item => {
                item.positionName =
                  item.departmentName + "/" + item.positionName;
              });
              this.userTable = userData;
              this.total = response.data.total;
              this.searchLoading = false;
              break;
            case 400:
              this.searchLoading = false;
              break;
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
    switchIconLock(status) {
      if (status === "锁定") {
        return "el-icon-unlock";
      } else {
        return "el-icon-lock";
      }
    },
    switchLockStatus(status) {
      if (status === "锁定") {
        return "启用";
      } else {
        return "锁定";
      }
    },
    handleUserLock(row) {
      if (row.status === "注销") {
        this.$message({
          showClose: true,
          message: "该账户已注销，无法进行该操作",
          type: "error"
        });
        return;
      }
      if (row.status === "禁用") {
        this.$message({
          showClose: true,
          message: "该账户已被禁用，请先启用该账户",
          type: "error"
        });
        return;
      }
      UserApi.switchUserStatus({
        username: row.username,
        status: this.switchLockStatus(row.status)
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
              break;
            case 400:
              break;
          }
          this.getUserTableData();
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    getTagType(status) {
      switch (status) {
        case "启用":
          return "success";
        case "禁用":
          return "danger";
        case "注销":
          return "info";
        case "锁定":
          return "warning";
        default:
          return "primary";
      }
    },
    handleUserPositionChange(val) {
      console.log(val);
      this.userForm.positionId = val;
    },
    switchIconClass(status) {
      if (status === "禁用") {
        return "el-icon-turn-off";
      } else {
        return "el-icon-open";
      }
    },
    handleAccountLevelChange(val) {
      this.userForm.accountLevel = val;
    },
    async handleUserEdit(row) {
      if (row.status === "注销") {
        this.$message({
          showClose: true,
          message: "该账户已注销，无法进行该操作",
          type: "error"
        });
        return;
      }
      await this.getDepartmentList();
      DepartmentApi.getDepartmentIdByPositionId({
        positionId: row.positionId
      })
        .then(response => {
          this.userForm.positionId = [
            response.data.departmentId,
            row.positionId
          ];
        })
        .catch(error => {
          this.blockLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
      this.userForm.username = row.username;
      this.userForm.label = row.positionName;
      this.userForm.positionId = this.departmentId;
      this.userForm.positionName = row.positionName;
      this.userForm.status = row.status;
      this.userForm.accountLevel = row.accountLevel;
      this.submitType = "更新";
      this.modalFormVisible = true;
    },
    switchStatus(status) {
      if (status === "禁用") {
        return "启用";
      } else {
        return "禁用";
      }
    },
    handleUserSwitch(row) {
      if (row.status === "注销") {
        this.$message({
          showClose: true,
          message: "该账户已注销，无法进行该操作",
          type: "error"
        });
        return;
      }
      UserApi.switchUserStatus({
        username: row.username,
        status: this.switchStatus(row.status)
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
              break;
            case 400:
              break;
          }
          this.getUserTableData();
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    handleUserDelete(row) {
      if (row.status === "注销") {
        this.$message({
          showClose: true,
          message: "该账户已注销，无法进行该操作",
          type: "error"
        });
        return;
      }
      UserApi.unsubscribeUser({
        username: row.username
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
              break;
            case 400:
              break;
          }
          this.getUserTableData();
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    handleUserRefreshPassword(row) {
      if (row.status === "注销") {
        this.$message({
          showClose: true,
          message: "该账户已注销，无法进行该操作",
          type: "error"
        });
        return;
      }
      UserApi.refreshPassword({
        username: row.username
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
              break;
            case 400:
              break;
          }
          this.getUserTableData();
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    getUserTableData() {
      this.tableLoading = true;
      UserApi.getUserTableByLimit({
        currentPage: this.currentPage,
        limit: this.limit
      })
        .then(response => {
          let code = response.data.responseCode;
          let tableData;
          switch (code) {
            case 200:
              tableData = response.data.tableData;
              tableData.forEach(item => {
                item.positionName =
                  item.departmentName + "/" + item.positionName;
              });
              this.total = response.data.total;
              this.userTable = tableData;
              break;
            case 400:
              break;
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
    getDepartmentList() {
      this.cascaderLoading = true;
      DepartmentApi.getDepartmentListData()
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.positionArr = response.data.positionArrayData;
              this.positionArr.forEach(item => {
                item.value = item.departmentId;
                item.label = item.departmentName;
                item.positions.forEach(node => {
                  node.value = node.positionId;
                  node.label = node.positionName;
                });
                item.children = item.positions;
              });
              this.cascaderLoading = false;
              break;
            case 400:
              this.cascaderLoading = false;
              break;
          }
        })
        .catch(error => {
          this.cascaderLoading = false;
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
          UserApi.updateUser({
            username: this.userForm.username,
            positionId: this.userForm.positionId[
              this.userForm.positionId.length - 1
            ],
            accountLevel: this.userForm.accountLevel,
            status: this.userForm.status,
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
                  break;
                case 400:
                  this.submitLoading = false;
                  break;
              }
              this.getUserTableData();
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
    closeModal() {
      this.userForm.username = "";
      this.userForm.positionId = "";
      this.userForm.positionName = "";
      this.userForm.accountLevel = 1;
      this.userForm.status = "";
      this.departmentId = "";
      this.modalFormVisible = false;
    }
  },
  mounted() {
    this.getUserTableData();
  },
  created() {}
};
</script>

<style scoped></style>
