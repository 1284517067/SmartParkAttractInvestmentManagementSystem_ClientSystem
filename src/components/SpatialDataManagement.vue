<template>
  <div style="height: 100%">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        空间管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        空间数据
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title-padding-bottom"></div>
    <div class="content-block">
      <el-row align="center" class="full-height">
        <el-col :span="4" class="full-height">
          <el-card class="full-height" :body-style="{ height: '100%' }">
            <div slot="header">
              <div class="text-left">
                空间树
              </div>
            </div>
            <el-tree
              highlight-current
              :data="spaceTreeData"
              :props="spaceTreeProps"
              v-loading="treeLoading"
              @node-click="handleNodeClick"
              :load="loadNode"
              lazy
            ></el-tree>
          </el-card>
        </el-col>
        <el-col :span="20" class="full-height">
          <el-card class="full-height" :body-style="{ height: '100%' }">
            <el-tabs
              v-model="activeSpaceType"
              @tab-click="handleTabClick"
              :value="activeSpaceType"
            >
              <el-tab-pane label="园区" name="园区"></el-tab-pane>
              <el-tab-pane label="楼栋" name="楼栋"></el-tab-pane>
              <el-tab-pane label="楼层" name="楼层"></el-tab-pane>
              <el-tab-pane label="房间" name="房间"></el-tab-pane>
            </el-tabs>
            <el-col>
              <div class="float-right">
                <template
                  v-if="activeSpaceType === '园区' && showNewButton === true"
                >
                  <el-button type="primary" @click="handleCreatePark"
                    >新增园区</el-button
                  >
                </template>
                <template
                  v-if="activeSpaceType !== '房间' && showNewButton === true"
                >
                  <el-button type="primary" @click="handleCreateButton"
                    >新增{{ activeArea }}</el-button
                  >
                </template>
                <el-button type="primary" @click="resetForm">重置</el-button>
                <el-button
                  type="primary"
                  :loading="submitLoading"
                  @click="submitForm('spaceForm')"
                  >保存</el-button
                >
                <el-button :loading="deleteLoading" @click="deleteSpace"
                  >删除</el-button
                >
              </div>
            </el-col>
            <div class="title-padding-bottom"></div>
            <el-form
              :model="spaceForm"
              :rules="rules"
              ref="spaceForm"
              style="width: 100%;height: 100%"
              label-position="left"
            >
              <el-row align="center" :gutter="30">
                <el-col :span="8">
                  <el-form-item :label="activeSpaceType + '编号：'">
                    <el-input type="text" v-model="spaceForm.spaceId" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="activeSpaceType + '名称：'"
                    prop="spaceName"
                  >
                    <el-input
                      type="text"
                      v-model="spaceForm.spaceName"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="activeSpaceType + '详细地址：'">
                    <el-input
                      type="text"
                      v-model="spaceForm.spaceAddress"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="activeSpaceType !== '园区'">
                  <el-form-item label="上层空间：">
                    <el-input
                      type="text"
                      v-model="spaceForm.parentName"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="空间层级：">
                    <el-input
                      type="text"
                      v-model="spaceForm.spaceType"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <template
                  v-if="
                    activeSpaceType === '园区' || activeSpaceType === '楼栋'
                  "
                >
                  <el-col :span="8">
                    <el-form-item label="占地面积(m²)：">
                      <el-input-number
                        :min="0"
                        v-model="spaceForm.areaCovered"
                        controls-position="right"
                        style="width: 100%"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="建筑面积(m²)：">
                      <el-input-number
                        :min="0"
                        controls-position="right"
                        style="width: 100%"
                        v-model="spaceForm.floorSpace"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                </template>
                <el-col :span="8">
                  <el-form-item label="单价(元)：">
                    <el-input-number
                      :min="0"
                      v-model="spaceForm.price"
                      controls-position="right"
                      style="width: 100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <template v-if="activeSpaceType === '房间'">
                  <el-col :span="8">
                    <el-form-item label="建筑面积(m²)：">
                      <el-input-number
                        :min="0"
                        controls-position="right"
                        v-model="spaceForm.floorSpace"
                        style="width: 100%"
                      >
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="租赁面积(m²)：">
                      <el-input-number
                        controls-position="right"
                        v-model="spaceForm.leaseArea"
                        style="width: 100%"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="租赁状态">
                      <el-input
                        type="text"
                        v-model="spaceForm.status"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </template>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import SpaceApi from "@/api/SpaceApi";

export default {
  name: "SpatialDataManagement",
  data() {
    return {
      treeLoading: false,
      spaceTreeData: [],
      spaceTreeProps: {
        label: "spaceName",
        children: "children",
        isLeaf: "leaf"
      },
      spaceForm: {
        spaceId: "",
        spaceName: "",
        spaceAddress: "",
        areaCovered: 0,
        floorSpace: 0,
        price: 0,
        spaceType: "",
        parentNodeId: "",
        parentName: "",
        leaseArea: "",
        status: ""
      },
      activeSpaceType: "园区",
      rules: {
        spaceName: [
          {
            required: true,
            message: "请输入空间名称",
            trigger: "blur"
          }
        ]
      },
      activeArea: "楼栋",
      showNewButton: true,
      activeTreeNode: "",
      submitLoading: false,
      deleteLoading: false
    };
  },
  methods: {
    handleTabClick() {
      this.switchNewButton();
      this.resetForm();
      this.showNewButton = true;
    },
    switchNewButton() {
      switch (this.activeSpaceType) {
        case "园区":
          this.activeArea = "楼栋";
          break;
        case "楼栋":
          this.activeArea = "楼层";
          break;
        case "楼层":
          this.activeArea = "房间";
          break;
      }
    },
    handleNodeClick(data) {
      this.spaceForm = JSON.parse(JSON.stringify(data));
      this.activeTreeNode = data;
      this.activeSpaceType = data.spaceType;
      this.showNewButton = true;
      this.switchNewButton();
    },
    getSpaceTree() {
      this.treeLoading = true;
      SpaceApi.getSpaceTreeData()
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.spaceTreeData = response.data.spaceTree;
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
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.spaceTreeData);
      }
      SpaceApi.lazyLoadSpaceLeaf({
        spaceId: node.data.spaceId
      })
        .then(response => {
          let code = response.data.responseCode;
          const data = response.data.leafData;
          if (code === 200) {
            resolve(data);
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
          return resolve([]);
        });
    },
    resetForm() {
      this.spaceForm.spaceId = "";
      this.spaceForm.areaCovered = 0;
      this.spaceForm.floorSpace = 0;
      this.spaceForm.leaseArea = 0;
      this.spaceForm.parentName = "";
      this.spaceForm.parentNodeId = "";
      this.spaceForm.price = 0;
      this.spaceForm.spaceAddress = "";
      this.spaceForm.spaceName = "";
      this.spaceForm.status = "";
      this.spaceForm.spaceType = "";
      this.$refs["spaceForm"].resetFields();
    },
    handleCreateButton() {
      if (this.spaceForm.spaceId === "") {
        this.$message({
          showClose: true,
          message: "请先选择" + this.activeSpaceType,
          type: "error"
        });
        return;
      }
      this.showNewButton = false;
      this.resetForm();
      this.activeSpaceType = this.activeArea;
      this.spaceForm.spaceType = this.activeArea;
      this.spaceForm.parentNodeId = this.activeTreeNode.spaceId;
      this.spaceForm.parentName = this.activeTreeNode.spaceName;
    },
    handleCreatePark() {
      this.activeSpaceType = "园区";
      this.resetForm();
      this.spaceForm.spaceType = "园区";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          SpaceApi.submitSpaceForm({
            space: this.spaceForm
          })
            .then(response => {
              let code = response.data.responseCode;
              if (code === 200) {
                this.$message({
                  showClose: true,
                  message: response.data.msg,
                  type: "success"
                });
              }
              this.submitLoading = false;
              this.getSpaceTree();
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
    deleteSpace() {
      if (this.spaceForm.spaceId === "") {
        this.$message({
          showClose: true,
          message: "请先选择空间",
          type: "error"
        });
        return;
      }
      this.deleteLoading = true;
      SpaceApi.deleteSpaceData({
        spaceId: this.spaceForm.spaceId
      })
        .then(response => {
          let code = response.data.responseCode;
          if (code === 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "success"
            });
            this.resetForm();
          }
          this.deleteLoading = false;
          this.getSpaceTree();
        })
        .catch(error => {
          this.deleteLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.getSpaceTree();
  }
};
</script>

<style scoped></style>
