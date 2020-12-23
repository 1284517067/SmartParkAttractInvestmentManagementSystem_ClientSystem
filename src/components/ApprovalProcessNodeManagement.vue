<template>
  <div style="height: 100%">
    <div style="height: 10px"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        基础管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        审批流程节点管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="padding"></div>
    <div class="title">审批流程节点管理</div>
    <div style="height: 20px;"></div>
    <el-row align="center">
      <el-col :span="4" :offset="1">
        <el-input type="text" v-model="searchKey" placeholder="请输入关键字">
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="searchByKey" :loading="searchLoading"
          >查询</el-button
        >
      </el-col>
      <el-col :span="2">
        <el-button type="primary" :loading="resetLoading" @click="resetTable">
          重置
        </el-button>
      </el-col>
    </el-row>
    <el-row align="center" style="padding-top: 20px;">
      <el-col :span="2" :offset="20">
        <el-button
          type="primary"
          @click="
            modalFormVisible = true;
            submitType = '新增';
          "
          >新增</el-button
        >
      </el-col>
    </el-row>

    <!-- 新增模态框 -->
    <el-dialog
      title="审批流节点"
      :visible.sync="modalFormVisible"
      width="35%"
      show-close
      destroy-on-close
      close-on-press-escape
      modal
      :before-close="closeModal"
      lock-scroll
    >
      <el-form
        :model="approvalProcessNodeForm"
        :rules="rules"
        ref="approvalProcessNodeForm"
        label-position="top"
        style="padding-left: 10%;padding-right: 10%"
        align="left"
      >
        <el-form-item label="审批流ID：">
          <el-input
            type="text"
            v-model="approvalProcessNodeForm.approvalProcessId"
            disabled
            style="max-width: 220px"
          ></el-input>
        </el-form-item>
        <el-form-item label="审批流名称：" prop="approvalProcessName">
          <el-select
            v-model="approvalProcessNodeForm.approvalProcessName"
            placeholder="请选择审批流"
            @focus="getApprovalProcessArray"
            @change="setApprovalProcessId"
            :loading="selectLoading"
            loading-text="正在加载..."
            @clear="clearSelect"
            clearable
          >
            <el-option
              v-for="item in approvalProcessArr"
              :key="item.num"
              :label="item.approvalProcessName"
              :value="item.approvalProcessName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in approvalProcessNodeForm.nodes"
          label="审批节点："
          :key="index"
        >
          <div class="node-block">
            <el-form-item
              label="审批节点名称："
              :prop="'nodes.' + index + '.approvalProcessNodeName'"
              :rules="[
                {
                  required: true,
                  message: '请输入节点名称',
                  trigger: 'blur'
                },
                {
                  max: 7,
                  message: '名称长度不能超过7个字符',
                  trigger: 'blur'
                }
              ]"
            >
              <el-input
                type="text"
                clearable
                v-model="item.approvalProcessNodeName"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="审批部门职位："
              :prop="'nodes.' + index + '.positionId'"
              :rules="[
                {
                  required: true,
                  message: '请选择审批部门职位',
                  trigger: 'change'
                }
              ]"
            >
              <el-cascader
                v-model="item.positionId"
                :options="positionArr"
                @focus="getDepartmentList"
                :loading="cascaderLoading"
                style="width: 90%"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-button
              v-if="index !== 0"
              icon="el-icon-minus"
              style="margin-top: 12%"
              @click.prevent="removeApprovalProcessNode(item)"
              circle
            ></el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-button style="width: 60%;" @click="addApprovalProcessNode"
        ><i class="el-icon-plus"></i
      ></el-button>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('approvalProcessNodeForm')"
          >重置</el-button
        >
        <el-button
          type="primary"
          @click="submitForm('approvalProcessNodeForm')"
          :loading="submitLoading"
          >保存</el-button
        >
      </div>
    </el-dialog>

    <!-- 新增模态框结束 -->

    <div class="node-block" style="margin-top: 50px ;padding-bottom: 5px">
      <div class="node-item">
        <div
          class="font-weight-bold title-color"
          style="display: block; float: left; min-width: 30%"
        >
          审批流信息
        </div>
        <div
          class="flow-block title-color"
          style="align-items: center;justify-content: center;padding-top: 0"
        >
          审批流程节点
        </div>
        <div class="title-color" style="width: 20%">
          操作
        </div>
      </div>
    </div>
    <div class="node-block" :loading="blockLoading">
      <div v-for="(item, index) in tableData" :key="item.num" class="node-item">
        <div style="display: block; float: left; min-width: 30%">
          <div class="small font-weight-lighter" style="color:#c4c4c4;">
            审批流ID：{{ item.approvalProcessId }}
          </div>
          <div class="small font-weight-lighter" style="color:#c4c4c4;">
            审批流名称：{{ item.approvalProcessName }}
          </div>
        </div>

        <div class="flow-block">
          <div
            v-for="(node, index) in item.nodes"
            :key="node.num"
            class="card-node-block"
          >
            <el-popover
              placement="top"
              trigger="hover"
              :class="{ 'float-left': index === item.nodes.length - 1 }"
            >
              <div class="small font-weight-light mx-auto">
                部门：{{ node.departmentName }}
              </div>
              <div class="small font-weight-light mx-auto">
                职位：{{ node.positionName }}
              </div>

              <el-button slot="reference" round>
                {{ node.approvalProcessNodeName }}
              </el-button>
            </el-popover>

            <div v-if="index !== item.nodes.length - 1" class="block">
              <el-image
                :src="require('@/assets/arrows.png')"
                fit="fit"
                style="width: 25px;height: 15px"
              ></el-image>
            </div>
          </div>
        </div>
        <div style="width: 10%">
          <el-button type="text" @click="editApprovalProcessNode(index)">
            <i class="el-icon-edit"></i>
          </el-button>
        </div>
        <div style="width: 10%">
          <el-popconfirm
            title="确认删除该审批流节点吗？"
            cancel-button-text="取消"
            cancel-button-type="default"
            confirm-button-type="primary"
            confirm-button-text="确定"
            @confirm="deleteApprovalProcessNode(item.approvalProcessId)"
          >
            <el-button type="text" slot="reference" :loading="deleteLoading">
              <i class="el-icon-delete"></i>
            </el-button>
          </el-popconfirm>
        </div>
      </div>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="limit"
      layout="total, sizes , prev , pager , next , jumper"
      :total="total"
      style="margin-top: 20px"
    >
    </el-pagination>
  </div>
</template>

<script>
import ApprovalProcessApi from "@/api/ApprovalProcessApi";
import DepartmentApi from "@/api/DepartmentApi";
import PositionApi from "@/api/PositionApi";
import ApprovalProcessNodeApi from "@/api/ApprovalProcessNodeApi";

export default {
  name: "ApprovalProcessNodeManagement",
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      modalFormVisible: false,
      approvalProcessNodeForm: {
        approvalProcessId: "",
        approvalProcessName: "",
        nodes: [
          {
            approvalProcessNodeName: "",
            positionId: []
          }
        ]
      },
      rules: {
        approvalProcessName: [
          {
            required: true,
            message: "请选择审批流名称",
            trigger: "change"
          }
        ]
      },
      selectLoading: false,
      submitLoading: false,
      approvalProcessArr: [
        {
          approvalProcessId: "",
          approvalProcessName: ""
        }
      ],
      positionArr: [],
      cascaderLoading: false,
      submitType: "",
      blockLoading: false,
      tableData: [
        {
          approvalProcessId: "",
          approvalProcessName: "",
          nodes: [
            /*{
              approvalProcessNodeName: "",
              positionId: "",
              positionName: "",
              departmentName: ""
            }*/
          ]
        }
      ],
      currentPage: 1,
      limit: 5,
      total: 0,
      deleteLoading: false,
      resetLoading: false
    };
  },
  methods: {
    resetTable() {
      this.resetLoading = true;
      this.getApprovalProcessNodeList();
      this.getApprovalProcessNodeCount();
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
      ApprovalProcessNodeApi.getApprovalProcessNodeListByKey({
        searchKey: this.searchKey
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
              this.tableData = response.data.dataList;
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
    closeModal() {
      this.approvalProcessNodeForm.approvalProcessId = "";
      this.approvalProcessNodeForm.approvalProcessName = "";
      this.approvalProcessNodeForm.nodes = [
        {
          approvalProcessId: "",
          approvalProcessName: ""
        }
      ];
      this.modalFormVisible = false;
    },
    getApprovalProcessArray() {
      this.selectLoading = true;
      ApprovalProcessApi.getApprovalProcessArrayData()
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.approvalProcessArr = response.data.approvalProcessArrayData;
              this.selectLoading = false;
              break;
            case 400:
              this.selectLoading = false;
              break;
          }
        })
        .catch(error => {
          this.selectLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    setApprovalProcessId(val) {
      console.log(val);
      if (val !== "") {
        let data = this.approvalProcessArr.filter(item => {
          return item.approvalProcessName === val;
        });
        if (
          data[0].approvalProcessId !== undefined &&
          data[0].approvalProcessName !== undefined
        ) {
          this.approvalProcessNodeForm.approvalProcessId =
            data[0].approvalProcessId;
          this.approvalProcessNodeForm.approvalProcessName =
            data[0].approvalProcessName;
        }
      }
    },
    handlePositionChange(val) {},
    addApprovalProcessNode() {
      this.approvalProcessNodeForm.nodes.push({
        approvalProcessNodeName: "",
        positionId: []
      });
    },
    clearSelect() {
      this.approvalProcessNodeForm.approvalProcessId = "";
      this.approvalProcessNodeForm.approvalProcessName = "";
    },
    removeApprovalProcessNode(item) {
      let index = this.approvalProcessNodeForm.nodes.indexOf(item);
      if (index !== -1) {
        this.approvalProcessNodeForm.nodes.splice(index, 1);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.submitLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          ApprovalProcessNodeApi.postApprovalProcessNodeForm({
            approvalProcessId: this.approvalProcessNodeForm.approvalProcessId,
            approvalProcessName: this.approvalProcessNodeForm
              .approvalProcessName,
            nodes: JSON.stringify(this.approvalProcessNodeForm.nodes),
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
                  this.modalFormVisible = false;
                  /**
                   * 刷新列表
                   * */
                  this.getApprovalProcessNodeList();
                  this.getApprovalProcessNodeCount();
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
        } else {
          this.submitLoading = false;
          return false;
        }
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
                  delete node.positionId;
                  delete node.posiitonName;
                });
                item.children = item.positions;
                delete item.departmentId;
                delete item.departmentName;
                delete item.positions;
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
    getApprovalProcessNodeList() {
      this.blockLoading = true;
      ApprovalProcessNodeApi.getApprovalProcessNodeListData({
        currentPage: this.currentPage,
        limit: this.limit
      })
        .then(response => {
          console.log(response.data);
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.blockLoading = false;
              this.tableData = response.data.dataList;
              break;
            case 400:
              this.blockLoading = false;
              break;
          }
        })
        .catch(error => {
          this.blockLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getApprovalProcessNodeList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getApprovalProcessNodeList();
    },
    getApprovalProcessNodeCount() {
      ApprovalProcessNodeApi.getApprovalProcessNodeCountData()
        .then(response => {
          this.total = response.data.count;
        })
        .catch(error => {
          this.blockLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    editApprovalProcessNode(index) {
      this.submitType = "更新";
      this.getDepartmentList();
      this.approvalProcessNodeForm.approvalProcessId = this.tableData[
        index
      ].approvalProcessId;
      this.approvalProcessNodeForm.approvalProcessName = this.tableData[
        index
      ].approvalProcessName;
      this.tableData[index].nodes.forEach(item => {
        item.label = item.departmentName + "/" + item.positionName;
        let arr = [];
        arr.push(item.positionId);
        item.value = arr;
      });
      this.approvalProcessNodeForm.nodes = this.tableData[index].nodes;
      this.modalFormVisible = true;
    },
    deleteApprovalProcessNode(approvalProcessId) {
      this.deleteLoading = true;
      ApprovalProcessNodeApi.deleteApprovalProcessNodeByApprovalProcessId({
        approvalProcessId: approvalProcessId
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
              this.getApprovalProcessNodeList();
              this.getApprovalProcessNodeCount();
              break;
            case 400:
              break;
          }
          this.deleteLoading = false;
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
          this.deleteLoading = false;
        });
    }
  },
  created() {},
  mounted() {
    this.getApprovalProcessNodeList();
    this.getApprovalProcessNodeCount();
  }
};
</script>

<style scoped>
.padding {
  width: 100%;
  height: 5%;
}
.node-block {
  position: relative;
  width: 90%;
  overflow: auto;
  margin-left: 5%;
  max-height: 50%;
  align-items: center;
  justify-content: center;
}
.node-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  width: 100%;
  height: 100%;
  min-height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.card-button {
  float: right;
  margin-right: 0px;
}
.card-node-block {
  height: 100%;
  min-width: 200px;
  padding: 10px 10px 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.block {
  display: flex;
  align-items: center;
  margin-left: 10%;
  justify-content: center;
  padding-bottom: 4%;
}
.float-left {
  padding-right: 30%;
}
.flow-block {
  display: flex;
  width: 50%;
  padding-top: 10px;
  overflow-x: auto;
}
.title-color {
  color: #909399;
}
</style>
