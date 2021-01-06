<template>
  <div style="height: 100%">
    <div style="height: 10px"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        基础管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        审批流程管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="padding"></div>
    <div class="title">审批流程管理</div>
    <div style="height: 20px;"></div>
    <el-row align="center">
      <el-col :span="4" :offset="2">
        <el-input
          type="text"
          v-model="searchKey"
          placeholder="请输入关键字"
        ></el-input>
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
    <el-row align="center" style="padding-top: 20px" :gutter="0">
      <el-col :span="2" :offset="20">
        <el-button type="primary" @click="modalFormVisible = true"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <!--新增/修改模态框-->
    <el-dialog
      title="审批流"
      :visible.sync="modalFormVisible"
      v-model="select"
      width="35%"
      show-close
      destroy-on-close
      modal
      :before-close="closeModal"
    >
      <div
        v-if="approvalProcessForm.approvalProcessId !== ''"
        class="edit-block"
      >
        <div>
          <el-switch
            v-model="sValue"
            :active-text="approvalProcessForm.status"
            @change="switchChange"
            :loading="switchLoading"
          >
          </el-switch>
        </div>
        <div style="margin-top: 10px;float: right">
          <el-popconfirm
            title="确认删除该审批流吗？"
            confirm-button-text="确定"
            confirm-button-type="warning"
            cancel-button-type="default"
            cancel-button-text="取消"
            @confirm="
              deleteApprovalProcess(approvalProcessForm.approvalProcessId)
            "
          >
            <el-button slot="reference" size="small" circle>
              <i class="el-icon-delete-solid"></i>
            </el-button>
          </el-popconfirm>
        </div>
      </div>

      <div style="width: 100%;height: 75px"></div>
      <el-form
        :model="approvalProcessForm"
        :rules="rules"
        ref="modalForm"
        inline
      >
        <el-form-item label="审批流ID：">
          <el-input
            type="text"
            v-model="approvalProcessForm.approvalProcessId"
            style="max-width: 200px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="审批流名称：" prop="approvalProcessName">
          <el-input
            type="text"
            v-model="approvalProcessForm.approvalProcessName"
            style="max-width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同类型：" prop="contractType">
          <el-select
            v-model="approvalProcessForm.contractType"
            placeholder="请选择合同类型"
            style="max-width: 200px"
          >
            <el-option label="入驻申请" value="入驻申请"></el-option>
            <el-option label="意向登记" value="意向登记"></el-option>
            <el-option label="意向协议" value="意向协议"></el-option>
            <el-option label="退租合同" value="退租合同"></el-option>
            <el-option label="租赁合同" value="租赁合同"></el-option>
            <el-option label="退园申请" value="退园申请"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型：" prop="businessType">
          <el-select
            v-model="approvalProcessForm.businessType"
            placeholder="请选择业务类型"
            style="max-width: 200px"
          >
            <el-option label="新签" value="新签"></el-option>
            <el-option label="续签" value="续签"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程描述：">
          <el-input
            type="textarea"
            v-model="approvalProcessForm.processDescription"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitApprovalProcess('modalForm')"
          :loading="submitLoading"
          >保存</el-button
        >
      </div>
    </el-dialog>

    <div class="row-block" v-loading="loading">
      <el-row align="center" justify="center" :gutter="100" style="width: 90%;">
        <el-col
          :span="6"
          v-for="item in approvalProcessData"
          v-bind:key="item.num"
          style="margin-top: 40px"
        >
          <el-popover
            placement="right"
            trigger="hover"
            width="400"
            @show="getApprovalProcessNode(item.approvalProcessId)"
          >
            <div
              style="width: 100%; min-height: 200px"
              v-loading="popoverLoading"
            >
              <div>
                <div class="small font-weight-lighter" style="color:#c4c4c4;">
                  审批流ID：{{ item.approvalProcessId }}
                </div>
                <div class="small font-weight-lighter " style="color:#c4c4c4">
                  业务类型：{{ item.contractType }}->{{ item.businessType }}
                </div>
                <div class="small font-weight-lighter" style="color:#c4c4c4;">
                  流程描述：{{ item.processDescription }}
                </div>
              </div>

              <div
                v-for="(item, index) in approvalProcessNode"
                :key="item.num"
                class="popover-block"
              >
                <div style="display: block">
                  <el-popover placement="right" trigger="hover">
                    <div class="small font-weight-light mx-auto">
                      部门：{{ item.departmentName }}
                    </div>
                    <div class="small font-weight-light mx-auto">
                      职位：{{ item.positionName }}
                    </div>

                    <el-button slot="reference" round>{{
                      item.approvalProcessNodeName
                    }}</el-button>
                  </el-popover>

                  <div
                    v-if="index !== approvalProcessNode.length - 1"
                    class="block"
                  >
                    <el-image :src="require('@/assets/arrows1.png')" />
                  </div>
                </div>
              </div>
            </div>
            <el-card
              shadow="hover"
              :body-style="{
                paddingTop: '0',
                paddingBottom: '10%',
                paddingRight: '10px',
                paddingLeft: '10px'
              }"
              slot="reference"
            >
              <el-button
                type="text"
                class="card-button"
                @click="updateApprovalProcess(item)"
                ><i class="el-icon-setting"></i
              ></el-button>
              <div style="padding: 10%"></div>
              <!--<span class="avatar-img">{{
                item.approvalProcessName.substring(0, 1)
              }}</span>-->
              <div style="width: 100%">
                <img src="@/assets/process.png" />
              </div>

              <div class="card-word">{{ item.approvalProcessName }}</div>
            </el-card>
          </el-popover>
        </el-col>
      </el-row>
    </div>
    <div style="height: 15px"></div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="8"
      :current-page="currentPage"
      layout="total , prev , pager , next , jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import ApprovalProcessApi from "@/api/ApprovalProcessApi";
import ApprovalProcessNodeApi from "@/api/ApprovalProcessNodeApi";

export default {
  name: "ApprovalProcessManagement",
  data() {
    return {
      approvalProcessData: [],
      approvalProcessNode: [],
      total: 0,
      limit: 8,
      currentPage: 1,
      loading: true,
      popoverLoading: true,
      modalFormVisible: false,
      select: "",
      approvalProcessForm: {
        approvalProcessId: "",
        approvalProcessName: "",
        contractType: "",
        businessType: "",
        processDescription: "",
        status: ""
      },
      rules: {
        approvalProcessName: [
          { required: true, message: "请输入审批流名称", trigger: "blur" }
        ],
        contractType: [
          { required: true, message: "请选择合同类型", trigger: "change" }
        ],
        businessType: [
          { required: true, message: "请选择业务类型", trigger: "change" }
        ]
      },
      submitLoading: false,
      searchKey: "",
      searchLoading: false,
      sValue: true,
      switchLoading: false,
      resetLoading: false
    };
  },
  methods: {
    resetTable() {
      this.resetLoading = true;
      this.getApprovalProcessData();
      this.getApprovalProcessTotal();
      this.resetLoading = false;
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getApprovalProcessData();
    },
    updateApprovalProcess(item) {
      this.approvalProcessForm.approvalProcessId = item.approvalProcessId;
      this.approvalProcessForm.approvalProcessName = item.approvalProcessName;
      this.approvalProcessForm.contractType = item.contractType;
      this.approvalProcessForm.businessType = item.businessType;
      this.approvalProcessForm.processDescription = item.processDescription;
      this.approvalProcessForm.status = item.status;
      switch (this.approvalProcessForm.status) {
        case "启用":
          this.sValue = true;
          break;
        case "废弃":
          this.sValue = false;
      }
      console.log(this.approvalProcessForm);
      this.modalFormVisible = true;
    },
    getApprovalProcessData() {
      ApprovalProcessApi.getApprovalProcessByLimit({
        currentPage: this.currentPage,
        limit: this.limit
      })
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.approvalProcessData = response.data.approvalProcessData;
              console.log(this.approvalProcessData);
              this.loading = false;
              break;
            case 400:
              this.loading = false;
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: "error"
              });
              break;
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    getApprovalProcessTotal() {
      ApprovalProcessApi.getApprovalProcessTotal()
        .then(response => {
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
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    getApprovalProcessNode(approvalProcessId) {
      ApprovalProcessNodeApi.getApprovalProcessNode({
        approvalProcessId: approvalProcessId
      })
        .then(response => {
          this.approvalProcessNode = response.data.approvalProcessNode;
          this.popoverLoading = false;
        })
        .catch(error => {
          this.popoverLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    submitApprovalProcess(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          ApprovalProcessApi.postApprovalProcess({
            approvalProcessId: this.approvalProcessForm.approvalProcessId,
            approvalProcessName: this.approvalProcessForm.approvalProcessName,
            contractType: this.approvalProcessForm.contractType,
            businessType: this.approvalProcessForm.businessType,
            processDescription: this.approvalProcessForm.processDescription
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
                  break;
                case 400:
                  this.submitLoading = false;
                  /*this.$message({
                      showClose: true,
                      message: response.data.msg,
                      type: "error"
                    });*/
                  break;
              }
              this.getApprovalProcessData();
              this.getApprovalProcessTotal();
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
    switchChange() {
      this.switchLoading = true;

      let status;
      switch (this.sValue) {
        case true:
          status = "启用";
          break;
        case false:
          status = "废弃";
          break;
      }
      ApprovalProcessApi.switchApprovalProcessStatus({
        approvalProcessId: this.approvalProcessForm.approvalProcessId,
        contractType: this.approvalProcessForm.contractType,
        businessType: this.approvalProcessForm.businessType,
        status: status
      })
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.switchLoading = false;
              this.approvalProcessForm.status = status;
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: "success"
              });
              break;
            case 400:
              this.switchLoading = false;
              this.sValue = !this.sValue;
              /*this.$message({
                showClose: true,
                message: response.data.msg,
                type: "error"
              });*/
              break;
          }
        })
        .catch(error => {
          this.switchLoading = false;
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    closeModal() {
      this.approvalProcessForm.approvalProcessId = "";
      this.approvalProcessForm.approvalProcessName = "";
      this.approvalProcessForm.contractType = "";
      this.approvalProcessForm.businessType = "";
      this.approvalProcessForm.processDescription = "";
      this.modalFormVisible = false;
      this.getApprovalProcessData();
      this.getApprovalProcessTotal();
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
      this.currentPage = 1;
      ApprovalProcessApi.searchApprovalProcessByKey({
        key: this.searchKey
      })
        .then(response => {
          let code = response.data.responseCode;
          switch (code) {
            case 200:
              this.approvalProcessData = response.data.approvalProcessData;
              this.total = response.data.total;
              this.searchLoading = false;
              break;
            case 400:
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: "error"
              });
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
    deleteApprovalProcess(approvalProcessId) {
      ApprovalProcessApi.deleteApprovalProcessData({
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
              this.modalFormVisible = false;
              break;
            case 400:
              this.modalFormVisible = false;
              break;
          }
          this.getApprovalProcessData();
          this.getApprovalProcessTotal();
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.getApprovalProcessData();
    this.getApprovalProcessTotal();
  },
  created() {}
};
</script>

<style>
.card-style {
  min-height: 200px;
}
.card-word {
  margin-top: 15%;
}
.avatar-img {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  padding: 10%;
  margin-top: 50%;
  background-color: #ecfef9;
  border: 1px solid #f4fffc;
  font-family: "PingFang SC";
  color: #cbd5d3;
  font-size: 50px;
}
.card-button {
  float: right;
  margin-right: 0px;
}
.row-block {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 500px;
}
.popover-block {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.block {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.edit-block {
  float: right;
  margin-right: 15%;
  display: block;
}
</style>
