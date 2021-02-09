<template xmlns:el-col="http://www.w3.org/1999/html">
  <div class="full-width">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        智慧物业
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        收费项管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title-padding-bottom"></div>
    <div class="content-block">
      <el-row>
        <el-col :span="4">
          <el-input
            type="text"
            placeholder="请输入关键字"
            v-model="searchKey"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="searchByKey"
            :loading="searchLoading"
            >查询</el-button
          >
          <el-button type="primary" @click="resetTableData">重置</el-button>
        </el-col>
      </el-row>
      <div class="title-padding-bottom"></div>
      <el-row>
        <el-col>
          <div class="float-right">
            <el-button type="primary" @click="handleNewPayItem">新增</el-button>
          </div>
        </el-col>
        <el-col>
          <el-table max-height="500" :data="tableData" v-loading="tableLoading">
            <el-table-column
              label="收费项名称"
              prop="itemName"
            ></el-table-column>
            <el-table-column label="单价" prop="price"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip placement="top" effect="dark" content="编辑">
                  <el-button
                    type="text"
                    @click="handleEditPayItem(scope.row.itemId)"
                  >
                    <i class="el-icon-edit"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip placement="top" effect="dark" content="删除">
                  <el-popconfirm
                    title="确认删除该公式吗？"
                    cancel-button-text="取消"
                    cancel-button-type="default"
                    confirm-button-type="primary"
                    confirm-button-text="确定"
                    @confirm="handleDeletePayItem(scope.row.itemId)"
                  >
                    <el-button type="text" slot="reference">
                      <i class="el-icon-delete"></i>
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
        </el-col>
      </el-row>
    </div>
    <!-- 新增/更新收费项模态框 -->
    <el-dialog
      show-close
      modal
      destroy-on-close
      width="80%"
      :visible.sync="modalFormVisible"
      :before-close="closeModal"
    >
      <el-row :gutter="20">
        <el-col>
          <el-button
            type="primary"
            class="float-right"
            @click="saveForm"
            :loading="saveLoading"
            >保存</el-button
          >
        </el-col>
        <el-form :model="payItem" :rules="rules" ref="payItemForm">
          <el-col :span="12">
            <el-form-item label="收费项名称" prop="itemName">
              <el-input
                type="text"
                class="full-width"
                v-model="payItem.itemName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价" prop="price">
              <el-input class="full-width" v-model="payItem.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="备注">
              <el-input
                type="textarea"
                class="full-width"
                v-model="payItem.remark"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-button
              type="primary"
              class="float-left"
              @click="handleNewPayItemFormula"
              >新增公式</el-button
            >
          </el-col>
          <el-col>
            <el-table :data="payItem.formulas">
              <el-table-column
                label="公式名称"
                prop="formulaName"
              ></el-table-column>
              <el-table-column label="公式" prop="formula"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-tooltip placement="top" effect="dark" content="删除">
                    <el-popconfirm
                      title="确认删除该公式吗？"
                      cancel-button-text="取消"
                      cancel-button-type="default"
                      confirm-button-type="primary"
                      confirm-button-text="确定"
                      @confirm="handleDeleteFormula(scope.$index)"
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
    </el-dialog>
    <!-- 新增/更新收费项模态框 -->
    <!-- 新增/更新公式模态框 -->
    <el-dialog
      destroy-on-close
      modal
      show-close
      width="40%"
      :before-close="closeFormulaModal"
      :visible.sync="formulaVisible"
      append-to-body
    >
      <el-form :model="payItemFormula" :rules="formulasRules" ref="formulaForm">
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="公式名称" prop="formulaName">
              <el-input
                type="text"
                class="full-width"
                v-model="payItemFormula.formulaName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="公式" prop="formula">
              <el-input
                type="text"
                v-model="payItemFormula.formula"
                placeholder="例：使用量*单价"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="closeFormulaModal">取消</el-button>
        <el-button type="primary" @click="updateFormula">确定</el-button>
      </div>
    </el-dialog>
    <!-- 新增/更新公式模态框 -->
  </div>
</template>

<script>
import PayItemApi from "@/api/PayItemApi";

export default {
  name: "PayItemManagement",
  data() {
    let validateNumber = (rule, value, callback) => {
      //包含小数的数字
      let reg = /^[+]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (value === "") {
        callback(new Error("请输入内容"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      searchKey: "",
      searchLoading: false,
      limit: 10,
      currentPage: 1,
      total: 0,
      tableLoading: false,
      tableData: [],
      modalFormVisible: false,
      formulaVisible: false,
      payItem: {
        itemId: "",
        itemName: "",
        price: "",
        remark: "",
        formulas: []
      },
      payItemFormula: {
        formulaName: "",
        formula: "",
        formulaId: "",
        itemId: ""
      },
      formulaType: "",
      saveLoading: false,
      rules: {
        itemName: [
          { required: true, message: "请输入收费项名称", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入单价", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ]
      },
      formulasRules: {
        formulaName: [
          { required: true, message: "请输入公式名称", trigger: "blur" }
        ],
        formula: [{ required: true, message: "请输入公式", trigger: "blur" }]
      }
    };
  },
  methods: {
    searchByKey() {
      if (this.searchKey === "") {
        this.$message({
          showClose: true,
          message: "请输入关键字",
          type: "error"
        });
        return;
      }
      this.saveLoading = true;
      PayItemApi.searchPayItemByKey({
        searchKey: this.searchKey
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.tableData = response.data.tableData;
            this.total = response.data.total;
          }
          this.searchLoading = false;
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
    resetTableData() {
      this.searchKey = "";
      this.getPayItemTable();
    },
    getPayItemTable() {
      this.tableLoading = true;
      PayItemApi.getPayItemTableData({
        limit: this.limit,
        currentPage: this.currentPage
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.tableData = response.data.tableData;
            this.total = response.data.total;
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
    handleNewPayItemFormula() {
      this.formulaVisible = true;
    },
    handleNewPayItem() {
      this.modalFormVisible = true;
    },
    async handleEditPayItem(itemId) {
      await PayItemApi.getPayItemDetail({
        itemId: itemId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.payItem = response.data.payItem;
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
      this.modalFormVisible = true;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getPayItemTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPayItemTableData();
    },
    handleDeleteFormula(index) {
      this.payItem.formulas.splice(index, 1);
    },
    closeModal() {
      this.$refs["payItemForm"].resetFields();
      Object.keys(this.payItem).forEach(item => {
        if (item === "formulas") {
          this.payItem[item] = [];
        } else {
          this.payItem[item] = "";
        }
      });
      this.modalFormVisible = false;
    },
    updateFormula() {
      this.$refs["formulaForm"].validate(valid => {
        if (valid) {
          let formula = JSON.parse(JSON.stringify(this.payItemFormula));
          this.payItem.formulas.push(formula);
          this.closeFormulaModal();
        } else {
          return false;
        }
      });
    },
    closeFormulaModal() {
      Object.keys(this.payItemFormula).forEach(item => {
        this.payItemFormula[item] = "";
      });
      this.formulaVisible = false;
    },
    saveForm() {
      this.$refs["payItemForm"].validate(valid => {
        if (valid) {
          this.saveLoading = true;
          PayItemApi.updatePayItem({
            payItem: this.payItem
          }).then(response => {
            if (response.data.responseCode === 200) {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: "success"
              });
              this.saveLoading = false;
              this.getPayItemTable();
              this.closeModal();
            }
          });
        } else {
          return false;
        }
      });
    },
    handleDeletePayItem(itemId) {
      PayItemApi.deletePayItem({
        itemId: itemId
      })
        .then(response => {
          if (response.data.responseCode == 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "success"
            });
          }
          this.getPayItemTable();
        })
        .catch(error => {
          this.getPayItemTable();
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.getPayItemTable();
  }
};
</script>

<style scoped></style>
