<template>
  <div style="height: 100%">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        系统管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        菜单管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title-padding-bottom"></div>
    <div class="content-block content-height" style="height: 80%">
      <el-row align="center" style="height: 100%">
        <el-col :span="6" style="height: 100%">
          <el-card
            :body-style="{ padding: '0', height: '100%' }"
            style="height: 100%"
          >
            <el-button-group class="button-group-block">
              <el-button
                type="default"
                class="button-group-item"
                @click="clearForm"
              >
                <i class="el-icon-plus"></i>
              </el-button>
              <el-popconfirm
                title="确认删除该菜单吗？"
                confirm-button-type="primary"
                confirm-button-text="确定"
                cancel-button-text="取消"
                cancel-button-type="default"
                @confirm="handleDeleteMenuNode"
              >
                <el-button
                  type="default"
                  class="button-group-item"
                  v-loading="deleteLoading"
                  slot="reference"
                >
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-popconfirm>
            </el-button-group>
            <div style="height: 95% ;width: 100%;overflow: auto">
              <el-tree
                :data="menuTree"
                :props="defaultProps"
                @node-click="handleNodeClick"
                v-loading="treeLoading"
              >
                <span slot-scope="{ node }">
                  <span>
                    <i
                      class="el-icon-document-copy"
                      style="color: #439ed5 ;margin-right: 10px"
                    ></i
                    >{{ node.label }}
                  </span>
                </span>
              </el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18" style="height: 100%">
          <el-card
            :body-style="{ padding: '20px' }"
            style="width: 100%;height: 100%"
          >
            <el-form
              :model="menuForm"
              :rules="rules"
              ref="menuForm"
              label-position="left"
              style="height: 100%"
            >
              <div class="float-right" style="margin-bottom: 10px">
                <el-button type="primary" @click="clearForm">重置</el-button>
                <el-button type="primary" @click="submitForm('menuForm')"
                  >保存</el-button
                >
              </div>
              <el-col style="height: 100% ; padding-top: 5%">
                <el-row :gutter="50" style="height: 100%">
                  <el-form-item
                    label="菜单状态："
                    prop="status"
                    style="padding: 0 20px 0 20px;"
                  >
                    <el-select
                      v-model="menuForm.status"
                      placeholder="请选择菜单状态"
                      style="width: 70%"
                    >
                      <el-option label="正常" value="正常"></el-option>
                      <el-option label="隐藏" value="隐藏"></el-option>
                    </el-select>
                  </el-form-item>

                  <div class="padding"></div>
                  <div style="width: 100% ;height: 30px"></div>
                  <el-col :span="6">
                    <el-form-item label="菜单ID：">
                      <el-input
                        type="text"
                        v-model="menuForm.menuId"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="菜单名称：" prop="menuName">
                      <el-input
                        type="text"
                        v-model="menuForm.menuName"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="display: flex">
                    <el-form-item label="菜单图标">
                      <el-input type="text" v-model="menuForm.icon"></el-input>
                    </el-form-item>
                    <i
                      v-if="menuForm.icon !== ''"
                      :class="menuForm.icon"
                      class="menu-icon"
                    ></i>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="父级菜单">
                      <el-select v-model="menuForm.fatherNodeId">
                        <el-option
                          v-for="(item, index) in menuList"
                          :key="index"
                          :label="item.menuName"
                          :value="item.menuId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col style="height: 10%"> </el-col>
                  <el-col>
                    <el-form-item label="菜单地址：">
                      <el-input
                        type="text"
                        v-model="menuForm.menuPath"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import MenuApi from "@/api/MenuApi";

export default {
  name: "MenuManagement",
  data() {
    return {
      menuTree: [
        {
          menuName: "",
          nodes: []
        }
      ],
      defaultProps: {
        label: "menuName",
        children: "nodes"
      },
      treeLoading: true,
      menuForm: {
        status: "",
        icon: "",
        menuPath: "",
        menuName: "",
        fatherNodeId: "",
        menuId: ""
      },
      rules: {
        status: [
          { required: true, message: "请选择菜单状态", trigger: "change" }
        ],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ]
      },
      menuList: [],
      submitLoading: false,
      activeNode: "",
      deleteLoading: false
    };
  },
  methods: {
    handleNodeClick(data) {
      this.activeNode = data;
      this.menuForm = JSON.parse(JSON.stringify(data));
    },
    getMenuTree() {
      this.treeLoading = true;
      MenuApi.getAllMenuTreeData()
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.menuTree = response.data.menuTree;
              break;
            case 400:
              break;
          }
          this.treeLoading = false;
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          MenuApi.updateMenu({
            status: this.menuForm.status,
            icon: this.menuForm.icon,
            menuPath: this.menuForm.menuPath,
            menuName: this.menuForm.menuName,
            fatherNodeId: this.menuForm.fatherNodeId,
            menuId: this.menuForm.menuId
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
              this.mountData();
              this.submitLoading = false;
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
    getMenuList() {
      MenuApi.getMenuListData()
        .then(response => {
          this.menuList = response.data.menuList;
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

    handleCreateMenuNode() {},
    mountData() {
      this.getMenuTree();
      this.getMenuList();
    },
    clearForm() {
      this.menuForm.menuId = "";
      this.menuForm.fatherNodeId = "";
      this.menuForm.menuName = "";
      this.menuForm.menuPath = "";
      this.menuForm.icon = "";
      this.menuForm.status = "";
    },
    handleDeleteMenuNode() {
      if (this.activeNode === "") {
        this.$message({
          showClose: true,
          message: "请先选择一个菜单",
          type: "error"
        });
        return;
      }
      this.deleteLoading = true;
      MenuApi.deleteMenu({
        menuId: this.activeNode.menuId
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
          this.deleteLoading = false;
          this.mountData();
        })
        .catch(error => {
          this.deleteLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
          this.mountData();
        });
    }
  },
  mounted() {
    this.mountData();
  }
};
</script>

<style scoped>
.content-height {
  max-height: 80%;
}
.button-group-block {
  width: 100%;
}
.button-group-item {
  width: 50%;
}
.menu-icon {
  font-size: 30px;
  margin-top: 45px;
  margin-left: 5%;
}
</style>
