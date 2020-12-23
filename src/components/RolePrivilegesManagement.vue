<template>
  <div style="height: 100%">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        系统管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        角色权限管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title-padding-bottom"></div>
    <div class="content-block">
      <el-row class="full-height" align="center">
        <el-col :span="6" style="height: 90%">
          <el-card class="full-height ">
            <div slot="header">
              <div class="text-left text-muted">
                <el-image
                  :src="require('@/assets/author.png')"
                  style="width: 20px;height: 20px; margin-right: 10px"
                ></el-image
                >部门角色
              </div>
            </div>

            <el-tree
              :data="departmentTree"
              :props="defaultProps"
              :loading="treeLoading"
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node }">
                <span class="tree-theme"
                  ><i
                    class="el-icon-folder-opened"
                    style="color:#439ed5;margin-right: 10px "
                  ></i
                  >{{ node.label }}</span
                >
              </span>
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="18" style="height: 90%">
          <el-card
            class="full-height"
            :body-style="{ maxHeight: '95%', overflow: 'auto' }"
          >
            <div slot="header">
              <div class="text-left">
                <el-image
                  :src="require('@/assets/authority.png')"
                  style="margin-right: 10px"
                ></el-image>
                角色对应的权限
              </div>
              <div
                v-if="this.activePosition.positionId !== undefined"
                class="float-right"
                style="position: absolute ; top: 10px;right: 10px"
              >
                <el-button type="primary" @click="resetPrivileges"
                  >重置</el-button
                >
                <el-button
                  type="primary"
                  class="float-right"
                  :loading="submitLoading"
                  @click="submitPrivileges"
                  >保存</el-button
                >
              </div>
            </div>
            <div v-if="activePosition.positionId !== undefined">
              <el-tree
                :data="menuTree"
                :props="menuTreeProps"
                show-checkbox
                node-key="menuId"
                ref="tree"
                highlight-current
                :default-checked-keys="privileges"
                :loading="menuTreeLoading"
              >
                <span slot-scope="{ node }">
                  <span class="tree-theme">
                    <i
                      class="el-icon-document"
                      style="color:#ecaf57;margin-right: 10px "
                    ></i
                    >{{ node.label }}
                  </span>
                </span>
              </el-tree>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import DepartmentApi from "@/api/DepartmentApi";
import MenuApi from "@/api/MenuApi";

export default {
  name: "RolePrivilegesManagement",
  data() {
    return {
      activePosition: "",
      departmentTree: [],
      defaultProps: {
        label: "label",
        children: "children"
      },
      treeLoading: false,
      privileges: [],
      menuTree: [],
      menuTreeProps: {
        label: "menuName",
        children: "nodes"
      },
      menuTreeLoading: false,
      submitLoading: false
    };
  },
  methods: {
    handleNodeClick(data) {
      this.activePosition = JSON.parse(JSON.stringify(data));
      console.log(this.activePosition);
      if (this.activePosition.positionId !== undefined) {
        this.getMenuTree();
        this.getMenuPrivileges();
      }
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
    getMenuTree() {
      this.menuTreeLoading = true;
      MenuApi.getMenuTreeData()
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.menuTree = response.data.menuTree;
              console.log(this.menuTree);
              break;
            case 400:
              break;
          }
          this.menuTreeLoading = false;
        })
        .catch(error => {
          this.menuTreeLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    getMenuPrivileges() {
      this.menuTreeLoading = true;
      MenuApi.getMenuPrivilegesData({
        positionId: this.activePosition.positionId
      })
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.privileges = response.data.privileges;
              console.log(this.privileges);
              this.$refs.tree.setCheckedKeys(this.privileges);
              break;
            case 400:
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
    resetPrivileges() {
      this.$refs.tree.setCheckedKeys([]);
    },
    submitPrivileges() {
      this.submitLoading = true;
      MenuApi.submitPrivilegesForm({
        positionId: this.activePosition.positionId,
        privileges: JSON.stringify(this.$refs.tree.getCheckedKeys())
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
          this.submitLoading = false;
          this.getMenuTree();
          this.getMenuPrivileges();
        })
        .catch(error => {
          this.submitLoading = false;
          this.getMenuTree();
          this.getMenuPrivileges();
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.getDepartmentTree();
  }
};
</script>

<style scoped></style>
