<template>
  <div class="full-width">
    <el-row :gutter="20">
      <el-col>
        <div class="float-right" v-if="activeName === '待发'">
          <el-button
            type="primary"
            :disabled="sendDisable"
            :loading="sendLoading"
            @click="sendForm"
            >送办</el-button
          >
          <el-button
            type="primary"
            :disabled="saveDisable"
            :loading="saveLoading"
            @click="saveForm"
            >保存</el-button
          >
        </div>
      </el-col>
      <el-form
        :model="leaseContractForm"
        :rules="rules"
        ref="leaseContractForm"
      >
        <el-col>
          <el-form-item label="合同名称">
            <el-input
              v-model="leaseContractForm.formName"
              class="full-width"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="客户名称" prop="enterpriseName">
            <el-input
              type="text"
              class="full-width"
              suffix-icon="el-icon-more"
              v-model="leaseContractForm.enterpriseName"
              @focus="handleEnterpriseComponentVisible"
              :disabled="itemDisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订日期" prop="signDate">
            <el-date-picker
              v-model="leaseContractForm.signDate"
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
          <el-form-item label="联系人">
            <el-input
              type="text"
              v-model="enterprise.contact"
              class="full-width"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话">
            <el-input
              type="text"
              v-model="enterprise.contactTel"
              class="full-width"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工商注册类型">
            <el-input
              type="text"
              v-model="enterprise.businessRegistrationType"
              class="full-width"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起租日期" prop="startDate">
            <el-date-picker
              v-model="leaseContractForm.startDate"
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
          <el-form-item label="止租日期" prop="expiryDate">
            <el-date-picker
              v-model="leaseContractForm.expiryDate"
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
          <el-form-item label="应收押金(元)" prop="deposit">
            <el-input
              type="text"
              v-model.number="leaseContractForm.deposit"
              class="full-width"
              :disabled="itemDisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="到期预警天数" prop="warningDate">
            <el-input-number
              v-model="leaseContractForm.warningDate"
              controls-position="right"
              :min="1"
              class="full-width"
              :disabled="itemDisable"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记日期">
            <el-date-picker
              v-model="leaseContractForm.applyDate"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              disabled
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登记人">
            <el-input
              type="text"
              class="full-width"
              v-model="leaseContractForm.applicant"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="activeName === '待发'">
          <el-button
            type="primary"
            class="float-left"
            @click="handleOpenSpaceModal"
            >新增租赁房间</el-button
          >
        </el-col>
        <el-col>
          <el-table max-height="200" :data="spaces" show-summary>
            <el-table-column label="园区" prop="parkName"></el-table-column>
            <el-table-column label="楼栋" prop="buildingName"></el-table-column>
            <el-table-column label="楼层" prop="floorName"></el-table-column>
            <el-table-column label="房间" prop="spaceName"></el-table-column>
            <el-table-column
              label="面积"
              prop="leaseArea"
              sortable
            ></el-table-column>
            <el-table-column
              label="单价"
              prop="price"
              sortable
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  content="删除"
                  effect="dark"
                  placement="top"
                  v-if="activeName === '待发'"
                >
                  <el-popconfirm
                    title="确认删除该租赁房间吗？"
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

        <el-col v-if="activeName === '待发'">
          <el-button
            class="float-left"
            style="margin-top: 20px"
            type="primary"
            @click="handlePayItemVisible"
            >新增房间收费项目</el-button
          >
        </el-col>
        <el-col>
          <el-table :data="payItems" max-height="200">
            <el-table-column label="房间" prop="spaceName"></el-table-column>
            <el-table-column label="收费项" prop="itemName"></el-table-column>
            <el-table-column label="公式" prop="formula"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  content="删除"
                  effect="dark"
                  placement="top"
                  v-if="activeName === '待发'"
                >
                  <el-popconfirm
                    title="确认删除该收费项吗？"
                    cancel-button-text="取消"
                    cancel-button-type="default"
                    confirm-button-type="primary"
                    confirm-button-text="确定"
                    @confirm="deletePayItem(scope.$index)"
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
        <!-- 租赁房间模态框 -->
        <el-dialog
          title="租赁房间选择"
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
            <el-button>取消</el-button>
          </div>
        </el-dialog>
        <!-- 租赁房间模态框结束 -->
        <!-- 租赁房间收费项模态框 -->
        <el-dialog
          title="收费项选择"
          :visible.sync="payItemFormVisible"
          :before-close="closePayItemModal"
          modal
          append-to-body
          destroy-on-close
          width="40%"
          show-close
        >
          <el-form :model="payItem" :rules="payItemRules" ref="payItemForm">
            <el-row :gutter="20">
              <el-col>
                <el-form-item label="房间" prop="spaceId">
                  <el-select v-model="payItem.spaceId" style="width: 100%">
                    <el-option
                      v-for="item in spaces"
                      :label="item.spaceName"
                      :value="item.spaceId"
                      :key="item.spaceId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收费项" prop="itemId">
                  <el-select v-model="payItem.itemId" style="width: 100%">
                    <el-option
                      v-for="item in payItemList"
                      :label="item.itemName"
                      :value="item.itemId"
                      :key="item.itemId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公式" prop="formulaId">
                  <el-select
                    v-model="payItem.formulaId"
                    style="width: 100%"
                    @focus="handleFormulaFocus"
                  >
                    <el-option
                      v-for="item in formulas"
                      :label="item.formula"
                      :value="item.formulaId"
                      :key="item.formulaId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer">
            <el-button @click="closePayItemModal">取消</el-button>
            <el-button type="primary" @click="confirmPayItem">确定</el-button>
          </div>
        </el-dialog>
        <!-- 租赁房间收费项模态框结束 -->
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { formatDate } from "@/assets/date";
import EnterpriseApi from "@/api/EnterpriseApi";
import SpaceApi from "@/api/SpaceApi";
import ChangeEnterprise from "@/components/ChangeEnterprise";
import LeaseContractApi from "@/api/LeaseContractApi";
import PayItemApi from "@/api/PayItemApi";

export default {
  name: "LeaseContractComponent",
  components: { ChangeEnterprise },
  props: ["activeName", "formId", "closeModal"],
  data() {
    let checkStartDate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择起租日期"));
      }

      let date = new Date(value);
      if (this.leaseContractForm.signDate === "") {
        return callback(new Error("请先选择签订日期"));
      }

      let signDate = new Date(this.leaseContractForm.signDate);
      if (date < signDate) {
        return callback(new Error("起租日期不能早于签订日期"));
      }

      return callback();
    };
    let checkExpiryDate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择止租日期"));
      }
      if (this.leaseContractForm.startDate === "") {
        return callback(new Error("请先选择起租日期"));
      } else {
        let startDate = new Date(this.leaseContractForm.startDate);
        let expiryDate = new Date(value);
        if (expiryDate < startDate) {
          return callback(new Error("止租日期不能小于起租日期"));
        } else {
          return callback();
        }
      }
    };
    let checkSignDate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择签订日期"));
      }
      let now = new Date(formatDate(new Date(), "yyyy-MM-dd"));
      let date = new Date(value);
      if (date > now) {
        return callback(new Error("签订日期不能晚于当前日期"));
      } else {
        return callback();
      }
    };
    return {
      leaseContractForm: {
        formId: "",
        formName: "",
        enterpriseId: "",
        enterpriseName: "",
        startDate: "",
        expiryDate: "",
        deposit: "",
        warningDate: 1,
        status: "",
        approvalStatus: "",
        signDate: "",
        applicant: "",
        applyDate: ""
      },
      enterprise: {
        contact: "",
        contactTel: "",
        businessRegistrationType: ""
      },
      rules: {
        enterpriseName: [
          { required: true, message: "请选择租户", trigger: "change" }
        ],
        deposit: [
          { required: true, message: "请输入押金", trigger: "blur" },
          { type: "number", message: "请输入整数值" }
        ],
        warningDate: [
          { required: true, message: "请输入到期预警天数", trigger: "change" },
          { type: "number", message: "天数必须为数字值" }
        ],
        startDate: [
          { required: true, message: "请选择起租日期", trigger: "change" },
          { validator: checkStartDate, trigger: "change" }
        ],
        expiryDate: [
          { required: true, message: "请选择止租日期", trigger: "change" },
          { validator: checkExpiryDate, trigger: "change" }
        ],
        signDate: [
          { required: true, message: "请选择签订日期", trigger: "change" },
          { validator: checkSignDate, trigger: "change" }
        ]
      },
      space: "",
      spaces: [],
      spaceList: [],
      spaceProps: {
        lazy: true,
        label: "spaceName",
        value: "spaceId",
        children: "children",
        isLeaf: "leaf",
        lazyLoad: (node, resolve) => {
          const { level } = node;
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
              enterpriseId: this.leaseContractForm.enterpriseId
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
      payItems: [],
      payItemList: [],
      payItem: {
        spaceId: "",
        spaceName: "",
        itemId: "",
        itemName: "",
        formulaId: "",
        formulaName: "",
        formula: ""
      },
      formulas: [],
      payItemRules: {
        itemId: [
          { required: true, message: "请选择收费项", trigger: "change" }
        ],
        spaceId: [{ required: true, message: "请选择房间", trigger: "change" }],
        formulaId: [
          { required: true, message: "请选择公式", trigger: "change" }
        ]
      },
      spaceModalVisible: false,
      enterpriseModalFormVisible: false,
      spaceModalFormVisible: false,
      payItemFormVisible: false,
      leaseArea: "",
      leasePrice: "",
      itemDisable: false,
      sendLoading: false,
      saveLoading: false,
      sendDisable: false,
      saveDisable: false
    };
  },
  methods: {
    async mountData() {
      if (this.activeName !== "待发") {
        this.itemDisable = true;
      }
      if (this.formId !== undefined && this.formId !== "") {
        await this.getLeaseContractForm();
        await this.getEnterpriseData();
        await this.getSpaceData();
        await this.getPayItemData();
      } else {
        this.leaseContractForm.applyDate = formatDate(new Date(), "yyyy-MM-dd");
        let user = JSON.parse(localStorage.getItem("userInfo"));
        this.leaseContractForm.applicant = user.username;
      }
    },
    async getLeaseContractForm() {
      await LeaseContractApi.getLeaseContractFormData({
        formId: this.formId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.leaseContractForm = response.data.form;
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
    sendForm() {
      this.$refs["leaseContractForm"].validate(valid => {
        if (valid) {
          this.sendLoading = true;
          this.saveDisable = true;
          LeaseContractApi.sendLeaseContract({
            leaseContract: this.leaseContractForm,
            spaces: this.spaces,
            payItems: this.payItems
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
    saveForm() {
      this.$refs["leaseContractForm"].validate(valid => {
        if (valid) {
          /* this.sendLoading = true;
          this.saveDisable = true;*/
          LeaseContractApi.saveLeaseContract({
            leaseContract: this.leaseContractForm,
            spaces: this.spaces,
            payItems: this.payItems
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
    handleEnterpriseChange(val) {
      this.leaseContractForm.enterpriseName = val.enterpriseName;
      this.leaseContractForm.enterpriseId = val.enterpriseId;
      this.leaseContractForm.formName =
        formatDate(new Date(), "yyyy-MM-dd") +
        "-" +
        this.leaseContractForm.enterpriseName +
        "-租赁合同";
      this.getEnterpriseData();
      this.enterpriseModalFormVisible = false;
    },
    handleEnterpriseComponentVisible() {
      this.enterpriseModalFormVisible = true;
    },
    handlePayItemVisible() {
      this.payItemFormVisible = true;
      PayItemApi.getPayItemList()
        .then(response => {
          if (response.data.responseCode === 200) {
            this.payItemList = response.data.payItemList;
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
        enterpriseId: this.leaseContractForm.enterpriseId
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
      await SpaceApi.getLeaseContractSpaceData({
        formId: this.leaseContractForm.formId
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
    async getPayItemData() {
      await PayItemApi.getLeaseContractPayItemData({
        formId: this.leaseContractForm.formId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.payItems = response.data.payItems;
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
    handleCascaderChange() {
      let node = this.$refs["spaceCascader"].getCheckedNodes()[0];
      this.leaseArea = node.data.leaseArea;
      this.leasePrice = node.data.price;
      this.space = node.data;
      this.space.floorName = node.parent.label;
      this.space.buildingName = node.parent.parent.label;
      this.space.parkName = node.parent.parent.parent.label;
    },
    handleFormulaFocus() {
      if (this.payItem.itemId === "") {
        this.$message({
          showClose: true,
          message: "请先选择收费项",
          type: "error"
        });
        return;
      }
      PayItemApi.getPayItemFormulasByItemId({
        itemId: this.payItem.itemId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.formulas = response.data.formulas;
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
    confirmPayItem() {
      this.$refs["payItemForm"].validate(valid => {
        if (valid) {
          console.log(1);
          let formula = this.formulas.find(item => {
            return (item.formulaId = this.payItem.formulaId);
          });
          let space = this.spaces.find(item => {
            return (item.spaceId = this.payItem.spaceId);
          });
          let payItem = this.payItemList.find(item => {
            return (item.itemId = this.payItem.itemId);
          });
          this.payItem.formulaName = formula.formulaName;
          this.payItem.formula = formula.formula;
          this.payItem.spaceName = space.spaceName;
          this.payItem.itemName = payItem.itemName;
          this.payItems.push(JSON.parse(JSON.stringify(this.payItem)));
          this.closePayItemModal();
        } else {
          return false;
        }
      });
    },
    closePayItemModal() {
      this.$refs["payItemForm"].resetFields();
      this.payItemFormVisible = false;
    },
    handleOpenSpaceModal() {
      if (
        this.leaseContractForm.enterpriseId === undefined ||
        this.leaseContractForm.enterpriseId === ""
      ) {
        this.$message({
          showClose: true,
          message: "请先选择客户",
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
    deleteSpace(index) {
      this.spaces.splice(index, 1);
    },
    deletePayItem(index) {
      this.payItems.splice(index, 1);
    },
    closeSpaceModal() {
      this.leasePrice = "";
      this.leaseArea = "";
      this.space = "";
      this.spaceModalVisible = false;
    },
    closeParentModal() {
      this.$refs["leaseContractForm"].resetFields();
      Object.keys(this.leaseContractForm).forEach(item => {
        this.leaseContractForm[item] = "";
      });
      Object.keys(this.payItem).forEach(item => {
        this.payItem[item] = "";
      });
      Object.keys(this.enterprise).forEach(item => {
        this.enterprise[item] = "";
      });
      this.space = [];
      this.payItems = [];
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
