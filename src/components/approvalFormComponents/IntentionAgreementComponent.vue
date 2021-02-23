<template>
  <div class="full-width full-height">
    <el-row :gutter="20">
      <el-col>
        <div class="float-right" v-if="activeName === '待发'">
          <el-button
            type="primary"
            :loading="sendLoading"
            @click="sendForm"
            :disabled="sendDisable"
            >送办</el-button
          >
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="saveForm"
            :disabled="submitDisable"
            >保存</el-button
          >
        </div>
      </el-col>

      <el-form
        :model="intentionAgreementForm"
        :rules="rules"
        ref="intentAgreementForm"
      >
        <el-col>
          <el-form-item label="协议名称">
            <el-input
              type="text"
              class="full-width"
              v-model="intentionAgreementForm.formName"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input
              type="text"
              class="full-width"
              suffix-icon="el-icon-more"
              v-model="intentionAgreementForm.enterpriseName"
              @focus="handleEnterpriseComponentVisible"
              :disabled="itemDisable"
            ></el-input>
          </el-form-item>
        </el-col>

        <!-- 企业选择模态框 -->
        <el-dialog
          width="50%"
          append-to-body
          :visible.sync="enterpriseModalFormVisible"
        >
          <ChangeEnterprise
            @enterprise-change="handleEnterpriseChange"
          ></ChangeEnterprise>
        </el-dialog>
        <!-- 企业选择模态框结束 -->

        <el-col :span="8">
          <el-form-item label="合同类型">
            <el-input
              type="text"
              class="full-width"
              v-model="enterprise.contractType"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="来源方式">
            <el-input
              type="text"
              class="full-width"
              v-model="enterprise.source"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业所属地区">
            <el-input
              type="text"
              class="full-width"
              v-model="enterprise.enterpriseArea"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行业类型">
            <el-select
              v-model="enterprise.industryTypeId"
              @focus="getIndustryTypeSelect"
              class="full-width"
              disabled
            >
              <el-option
                v-for="item in industryTypeList"
                :key="item.industryTypeId"
                :label="item.industryTypeName"
                :value="item.industryTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人">
            <el-input
              type="text"
              class="full-width"
              v-model="enterprise.contact"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人部门">
            <el-input
              type="text"
              class="full-width"
              v-model="enterprise.contactDepartment"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人职位">
            <el-input
              type="text"
              class="full-width"
              v-model="enterprise.contactPosition"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话">
            <el-input
              type="text"
              class="full-width"
              v-model="enterprise.contactTel"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系QQ">
            <el-input
              type="text"
              class="full-width"
              v-model="enterprise.qq"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱地址">
            <el-input
              type="text"
              class="full-width"
              v-model="enterprise.contactEmail"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="意向金(元)" prop="earnest">
            <el-input
              type="text"
              class="full-width"
              v-model.number="intentionAgreementForm.earnest"
              :disabled="itemDisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="房间最晚保留日期" prop="deadline">
            <el-date-picker
              v-model="intentionAgreementForm.deadline"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :disabled="itemDisable"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请日期">
            <el-date-picker
              v-model="intentionAgreementForm.applyDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              disabled
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人">
            <el-input
              type="text"
              class="full-width"
              v-model="intentionAgreementForm.applicant"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="intentionAgreementForm.remark"
              :disabled="itemDisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="activeName === '待发'">
          <el-button
            type="primary"
            class="float-left"
            @click="handleOpenSpaceModal"
            >新增意向房间</el-button
          >
        </el-col>
        <el-col>
          <el-table height="200" :data="spaces">
            <el-table-column label="园区" prop="parkName"></el-table-column>
            <el-table-column label="楼栋" prop="buildingName"></el-table-column>
            <el-table-column label="楼层" prop="floorName"></el-table-column>
            <el-table-column label="房间" prop="spaceName"></el-table-column>
            <el-table-column label="面积" prop="leaseArea"></el-table-column>
            <el-table-column label="单价" prop="price"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
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
                    @confirm="deleteSpace(scope.$index)"
                  >
                    <el-button type="text" slot="reference">
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-form>
    </el-row>
    <el-dialog
      title="意向房间选择"
      show-close
      destroy-on-close
      width="30%"
      :visible.sync="spaceModalVisible"
      modal
      :before-close="closeSpaceModal"
      append-to-body
    >
      <el-cascader
        ref="spaceCascader"
        v-model="spaceList"
        :props="spaceProps"
        @change="handleCascaderChange"
        clearable
      ></el-cascader>
      <div class="top-padding"></div>
      <el-form>
        <el-form-item label="租赁面积(m²)">
          <el-input v-model="leaseArea" readonly></el-input>
        </el-form-item>
        <el-form-item label="租金单价(元)">
          <el-input v-model="leasePrice" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveSpace">保存</el-button>
        <el-button @click="spaceModalVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/assets/date";
import ChangeEnterprise from "@/components/ChangeEnterprise";
import IndustryTypeApi from "@/api/IndustryTypeApi";
import IntentionAgreementApi from "@/api/IntentionAgreementApi";
import EnterpriseApi from "@/api/EnterpriseApi";
import SpaceApi from "@/api/SpaceApi";
import ApprovalOpinions from "@/components/ApprovalOpinions";

export default {
  name: "IntentionAgreementComponent",
  components: { ChangeEnterprise },
  props: ["formId", "activeName", "closeModal"],
  data() {
    return {
      intentionAgreementForm: {
        formId: "",
        formName: "",
        enterpriseId: "",
        enterpriseName: "",
        earnest: "",
        deadline: "",
        applyDate: "",
        applicant: "",
        remark: "",
        status: ""
      },
      enterprise: {
        contractType: "",
        source: "",
        enterpriseArea: "",
        industryTypeId: "",
        contact: "",
        contactDepartment: "",
        contactPosition: "",
        contactTel: "",
        contactEmail: "",
        qq: ""
      },
      industryTypeList: [],
      space: "",
      spaces: [],
      spaceList: [],
      rules: {
        enterpriseName: [
          { required: true, message: "请选择企业", trigger: "change" }
        ],
        earnest: [
          { required: true, message: "输入意向金", trigger: "blur" },
          { type: "number", message: "意向金必须为数字值" }
        ],
        deadline: [
          { required: true, message: "请选择房间最晚保留日期", trigger: "blur" }
        ]
      },
      spaceProps: {
        lazy: true,
        label: "spaceName",
        value: "spaceId",
        children: "children",
        isLeaf: "leaf",
        lazyLoad: (node, resolve) => {
          const { level } = node;
          console.log(node);
          if (level === 0) {
            SpaceApi.getSpaceTreeData()
              .then(response => {
                if (response.data.responseCode === 200) {
                  const nodes = response.data.spaceTree;
                  return resolve(nodes);
                }
              })
              .catch(error => {
                console.log(error);
                return resolve([]);
              });
          } else {
            SpaceApi.lazyLoadIntentionAgreementSpaceLeaf({
              spaceId: node.data.spaceId,
              enterpriseId: this.intentionAgreementForm.enterpriseId
            })
              .then(response => {
                if (response.data.responseCode === 200) {
                  const data = response.data.leafData;
                  return resolve(data);
                }
              })
              .catch(error => {
                console.log(error);
                return resolve([]);
              });
          }
        }
      },
      enterpriseModalFormVisible: false,
      spaceModalVisible: false,
      itemDisable: false,
      leaseArea: "",
      leasePrice: "",
      sendLoading: false,
      submitLoading: false,
      sendDisable: false,
      submitDisable: false
    };
  },
  methods: {
    async mountData() {
      if (this.activeName !== "待发") {
        this.itemDisable = true;
      }
      if (this.formId !== undefined && this.formId !== "") {
        await this.getIntentionAgreementFormData();
        await this.getEnterpriseData();
        await this.getSpaceData();
      } else {
        this.intentionAgreementForm.applyDate = formatDate(
          new Date(),
          "yyyy-MM-dd"
        );
        let user = JSON.parse(localStorage.getItem("userInfo"));
        this.intentionAgreementForm.applicant = user.username;
      }
    },
    handleCascaderChange() {
      let node = this.$refs["spaceCascader"].getCheckedNodes()[0];
      console.log(node);
      this.leaseArea = node.data.leaseArea;
      this.leasePrice = node.data.price;
      this.space = node.data;
      this.space.floorName = node.parent.label;
      this.space.buildingName = node.parent.parent.label;
      this.space.parkName = node.parent.parent.parent.label;
    },
    handleEnterpriseChange(val) {
      this.intentionAgreementForm.enterpriseName = val.enterpriseName;
      this.intentionAgreementForm.enterpriseId = val.enterpriseId;
      this.intentionAgreementForm.formName =
        formatDate(new Date(), "yyyy-MM-dd") +
        "-" +
        this.intentionAgreementForm.enterpriseName +
        "-意向协议";
      this.getEnterpriseData();
      this.enterpriseModalFormVisible = false;
    },
    handleEnterpriseComponentVisible() {
      this.enterpriseModalFormVisible = true;
    },
    getIndustryTypeSelect() {
      IndustryTypeApi.getIndustryTypeSelectData()
        .then(response => {
          if (response.data.responseCode === 200) {
            this.industryTypeList = response.data.industryTypeList;
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
    async getIntentionAgreementFormData() {
      await IntentionAgreementApi.getIntentionAgreementForm({
        formId: this.formId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.intentionAgreementForm = response.data.form;
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
    async getEnterpriseData() {
      await EnterpriseApi.getIntentionAgreementComponentEnterpriseData({
        enterpriseId: this.intentionAgreementForm.enterpriseId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.enterprise = response.data.enterprise;
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
    async getSpaceData() {
      await SpaceApi.getIntentionAgreementComponentSpaceData({
        formId: this.intentionAgreementForm.formId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.spaces = response.data.spaces;
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
    deleteSpace(index) {
      this.spaces.splice(index, 1);
    },
    handleOpenSpaceModal() {
      if (
        this.intentionAgreementForm.enterpriseId === undefined ||
        this.intentionAgreementForm.enterpriseId === ""
      ) {
        this.$message({
          showClose: true,
          message: "请先选择企业",
          type: "error"
        });
        return;
      }
      this.spaceModalVisible = true;
    },
    saveSpace() {
      let node = JSON.parse(JSON.stringify(this.space));
      this.spaces.push(node);
      this.closeSpaceModal();
    },
    closeSpaceModal() {
      this.leasePrice = "";
      this.leaseArea = "";
      this.space = "";
      this.spaceModalVisible = false;
    },
    saveForm() {
      this.$refs["intentAgreementForm"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.sendDisable = true;
          IntentionAgreementApi.saveIntentionAgreementForm({
            intentionAgreementForm: this.intentionAgreementForm,
            spaces: this.spaces
          })
            .then(response => {
              if (response.data.responseCode === 200) {
                this.$message({
                  showClose: true,
                  message: response.data.msg,
                  type: "success"
                });
              }
              this.resetButtonStatus();
              this.closeParentModal();
            })
            .catch(error => {
              this.resetButtonStatus();
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
    sendForm() {
      this.$refs["intentAgreementForm"].validate(valid => {
        if (valid) {
          this.sendLoading = true;
          this.submitDisable = true;
          IntentionAgreementApi.sendIntentionAgreementFrom({
            intentionAgreementForm: this.intentionAgreementForm,
            spaces: this.spaces
          })
            .then(response => {
              if (response.data.responseCode === 200) {
                this.$message({
                  showClose: true,
                  message: response.data.msg,
                  type: "success"
                });
              }
              this.resetButtonStatus();
              this.closeParentModal();
            })
            .catch(error => {
              this.resetButtonStatus();
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
    resetButtonStatus() {
      this.submitDisable = false;
      this.submitLoading = false;
      this.sendLoading = false;
      this.sendDisable = false;
    },
    closeParentModal() {
      this.$refs["intentAgreementForm"].resetFields();
      Object.keys(this.intentionAgreementForm).forEach(item => {
        this.intentionAgreementForm[item] = "";
      });
      Object.keys(this.enterprise).forEach(item => {
        this.enterprise[item] = "";
      });
      this.space = [];
      if (this.closeModal != null) {
        this.closeModal();
      }
    }
  },
  mounted() {
    this.mountData();
  }
};
</script>

<style scoped></style>
