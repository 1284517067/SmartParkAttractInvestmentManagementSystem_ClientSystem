<template>
  <div style="height: 100%">
    <div class="top-padding"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        智慧招商
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        企业管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        企业档案
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title-padding-bottom"></div>
    <el-row>
      <el-col :span="4" :offset="1">
        <el-input
          type="text"
          placeholder="请输入关键字"
          v-model="searchKey"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="searchByKey">查询</el-button>
        <el-button type="primary" @click="resetTableData">重置</el-button>
      </el-col>
    </el-row>

    <!-- 新增/更新模态框 -->
    <el-dialog
      title="企业档案"
      :visible="enterpriseFormVisible"
      width="80%"
      show-close
      destroy-on-close
      :before-close="closeFormModal"
      modal
    >
      <el-row align="center" :gutter="50">
        <el-form :model="enterpriseForm" :rules="rules" ref="enterpriseForm">
          <el-col :span="8">
            <el-form-item label="企业ID：">
              <el-input
                type="text"
                v-model="enterpriseForm.enterpriseId"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业名称" prop="enterpriseName">
              <el-input
                type="text"
                v-model="enterpriseForm.enterpriseName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业状态" prop="status">
              <el-select
                placeholder="请选择"
                v-model="enterpriseForm.status"
                class="full-width"
              >
                <el-option label="正常" value="正常"></el-option>
                <el-option label="筹建" value="筹建"></el-option>
                <el-option label="在建" value="在建"></el-option>
                <el-option label="投产" value="投产"></el-option>
                <el-option label="退园" value="退园"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业性质" prop="enterpriseNature">
              <el-select
                placeholder="请选择企业性质"
                v-model="enterpriseForm.enterpriseNature"
                class="full-width"
              >
                <el-option label="个人" value="个人"></el-option>
                <el-option label="私营" value="私营"></el-option>
                <el-option label="内资" value="内资"></el-option>
                <el-option label="外资" value="外资"></el-option>
                <el-option label="分公司" value="分公司"></el-option>
                <el-option label="中外合资" value="中外合资"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入驻园区">
              <el-select
                placeholder="请选择入驻园区"
                v-model="enterpriseForm.enterPark"
                class="full-width"
                @focus="getParkSelect"
                @change="handleParkSelectChange"
              >
                <el-option
                  v-for="item in parkList"
                  :key="item.spaceId"
                  :label="item.spaceName"
                  :value="item.spaceId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入驻时间" prop="enterTime">
              <el-date-picker
                v-model="enterpriseForm.enterTime"
                type="date"
                placeholder="请选择入驻时间"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记时间" prop="recordDate">
              <el-date-picker
                v-model="enterpriseForm.recordDate"
                type="date"
                placeholder="请选择登记时间"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册时间">
              <el-date-picker
                v-model="enterpriseForm.registrationTime"
                type="date"
                placeholder="请选择注册时间"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业电话" prop="enterpriseTel">
              <el-input
                type="text"
                v-model="enterpriseForm.enterpriseTel"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="办公地址" prop="officeAddress">
              <el-input
                type="text"
                v-model="enterpriseForm.officeAddress"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同类型" prop="contractType">
              <el-select
                placeholder="请选择合同类型"
                v-model="enterpriseForm.contractType"
                class="full-width"
              >
                <el-option label="租赁合同" value="租赁合同"></el-option>
                <el-option label="物业合同" value="物业合同"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业所属地区" prop="enterpriseArea">
              <el-input
                type="text"
                v-model="enterpriseForm.enterpriseArea"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="contact">
              <el-input type="text" v-model="enterpriseForm.contact"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人电话" prop="contactTel">
              <el-input
                type="text"
                v-model="enterpriseForm.contactTel"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人部门">
              <el-input
                type="text"
                v-model="enterpriseForm.contactDepartment"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人职位">
              <el-input
                type="text"
                v-model="enterpriseForm.contactPosition"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行业类型" prop="industryTypeId">
              <el-select
                v-model="enterpriseForm.industryTypeId"
                @focus="getIndustryTypeSelect"
                class="full-width"
              >
                <el-option
                  v-for="item in industryTypeList"
                  :key="item.industryTypeId"
                  :label="item.industryTypeName"
                  :value="item.industryTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业法人" prop="enterpriseLegalPerson">
              <el-input
                type="text"
                v-model="enterpriseForm.enterpriseLegalPerson"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业邮箱" prop="enterpriseEmail">
              <el-input
                type="text"
                v-model="enterpriseForm.enterpriseEmail"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册资本" prop="registeredCapital">
              <el-input
                type="text"
                v-model.number="enterpriseForm.registeredCapital"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工商注册类型" prop="businessRegistrationType">
              <el-select
                placeholder="请选择工商注册类型"
                v-model="enterpriseForm.businessRegistrationType"
                class="full-width"
              >
                <el-option label="国有经济" value="国有经济"></el-option>
                <el-option
                  label="有限责任公司"
                  value="有限责任公司"
                ></el-option>
                <el-option label="集体经济" value="集体经济"></el-option>
                <el-option label="私营经济" value="私营经济"></el-option>
                <el-option label="个体经济" value="个体经济"></el-option>
                <el-option label="联营经济" value="联营经济"></el-option>
                <el-option label="股份制" value="股份制"></el-option>
                <el-option label="外商投资" value="外商投资"></el-option>
                <el-option label="港澳台投资" value="港澳台投资"></el-option>
                <el-option label="其他经济" value="其他经济"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="企业简介">
              <el-input
                type="textarea"
                v-model="enterpriseForm.enterpriseIntroduction"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="closeFormModal">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading"
          >保存</el-button
        >
      </div>
    </el-dialog>

    <!-- 新增/更新模态框结束-->

    <!-- 信息展示模态框 -->
    <el-dialog
      :visible.sync="enterpriseDetailVisible"
      width="90%"
      show-close
      destroy-on-close
      modal
    >
      <div class="full-width flex-block" style="padding: 0 20px">
        <div class="text-left title font-weight-bold">
          {{ enterpriseForm.enterpriseName }}
          <el-tag
            style="margin-left: 30px ; margin-bottom: 5px"
            disable-transitions
            >{{ enterpriseForm.status }}</el-tag
          >
        </div>
      </div>
      <div class="title-padding-bottom"></div>
      <el-row class="full-width">
        <el-col :span="8" class="flex-left">
          <div class="first-label">
            行业类型
          </div>
          <div class="first-text">
            {{ enterpriseForm.industryTypeName }}
          </div>
        </el-col>
        <el-col :span="8" class="flex-left">
          <div class="first-label">
            企业状态
          </div>
          <div class="first-text">
            {{ enterpriseForm.status }}
          </div>
        </el-col>
        <el-col :span="8" class="flex-left">
          <div class="first-label">
            所属地区
          </div>
          <div class="first-text">
            {{ enterpriseForm.enterpriseArea }}
          </div>
        </el-col>
        <el-col :span="8" class="flex-left">
          <div class="first-label">
            注册类型
          </div>
          <div class="first-text">
            {{ enterpriseForm.businessRegistrationType }}
          </div>
        </el-col>
        <el-col :span="8" class="flex-left">
          <div class="first-label">
            办公地址
          </div>
          <div class="first-text">
            {{ enterpriseForm.officeAddress }}
          </div>
        </el-col>
      </el-row>
      <div class="title-padding-bottom"></div>
      <el-row align="center" style="padding: 0 20px">
        <el-col>
          <el-tabs active-name="first">
            <el-tab-pane label="基础信息" name="first"></el-tab-pane>
          </el-tabs>
        </el-col>
        <div class="top-padding"></div>
        <template v-for="(value, key) in enterpriseForm">
          <el-col
            :span="6"
            class="message-theme"
            :key="key"
            v-if="
              key !== 'enterpriseId' &&
                key !== 'industryTypeId' &&
                key !== 'enterPark' &&
                key !== 'enterpriseIntroduction'
            "
          >
            <div class="second-label">
              {{ getOptionName(key) }}
            </div>
            <div class="second-text">
              {{ value }}
            </div>
          </el-col>
        </template>
        <el-col class="message-theme" style="min-height: 50px;">
          <el-col :span="3" class="introduction-label">
            企业简介
          </el-col>
          <el-col :span="21" class="introduction-text">
            {{ enterpriseForm.enterpriseIntroduction }}
          </el-col>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 信息展示模态框结束-->

    <div class="content-block" style="height: 85%">
      <el-button
        type="primary"
        @click="enterpriseFormVisible = true"
        class="float-right"
        >新增</el-button
      >
      <div class="title-padding-bottom"></div>
      <el-table :data="tableData" :loading="tableLoading" max-height="500px">
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
        ></el-table-column>
        <el-table-column prop="industryTypeName" label="所属行业">
        </el-table-column>
        <el-table-column prop="spaceName" label="入驻园区"> </el-table-column>
        <el-table-column prop="enterTime" label="入驻时间"> </el-table-column>
        <el-table-column prop="status" label="企业状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleShowDetail(scope.row)">
              <i class="el-icon-view"></i>
            </el-button>
            <el-button type="text" @click="handleUpdateEnterprise(scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="top-padding"></div>
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
import EnterpriseApi from "@/api/EnterpriseApi";
import SpaceApi from "@/api/SpaceApi";
import IndustryTypeApi from "@/api/IndustryTypeApi";

let checkPhone = (rule, value, callback) => {
  let reg = /^1[345789]\d{9}$/;
  if (!reg.test(value)) {
    callback(new Error("请输入11位手机号"));
  } else {
    callback();
  }
};
export default {
  name: "EnterpriseArchives",
  data() {
    return {
      searchKey: "",
      searchLoading: false,
      tableData: [],
      tableLoading: false,
      total: 0,
      limit: 10,
      currentPage: 1,
      enterpriseForm: {
        enterpriseId: "",
        enterpriseName: "",
        status: "",
        enterpriseNature: "",
        enterTime: "",
        officeAddress: "",
        enterpriseLegalPerson: "",
        registrationTime: "",
        contact: "",
        contactTel: "",
        contactDepartment: "",
        contactPosition: "",
        enterpriseEmail: "",
        registeredCapital: "",
        industryTypeId: "",
        industryTypeName: "",
        enterpriseArea: "",
        businessRegistrationType: "",
        enterPark: "",
        recordDate: "",
        contractType: "",
        enterpriseIntroduction: "",
        enterpriseTel: "",
        spaceName: ""
      },
      rules: {
        enterpriseName: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择企业状态", trigger: "change" }
        ],
        enterpriseNature: [
          { required: true, message: "请选择企业性质", trigger: "change" }
        ],
        enterTime: [
          {
            required: true,
            message: "请选择入驻时间",
            trigger: "change"
          }
        ],
        officeAddress: [
          { required: true, message: "请输入办公地址", trigger: "blur" }
        ],
        recordDate: [
          {
            required: true,
            message: "请选择登记时间",
            trigger: "change"
          }
        ],
        contractType: [
          { required: true, message: "请选择合同类型", trigger: "change" }
        ],
        enterpriseArea: [
          { required: true, message: "请输入企业所属地区", trigger: "blur" }
        ],
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contactTel: [
          { required: true, message: "请输入联系人电话号码", trigger: "blur" },
          {
            type: "number",
            validator: checkPhone,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        industryTypeId: [
          { required: true, message: "请选择行业类型", trigger: "change" }
        ],
        enterpriseTel: [
          { required: true, message: "请输入企业电话号码", trigger: "blur" },
          {
            type: "number",
            validator: checkPhone,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        enterpriseEmail: [
          { required: true, message: "请输入企业邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        businessRegistrationType: [
          { required: true, message: "请选择工商注册类型", trigger: "change" }
        ],
        registeredCapital: [
          { required: true, message: "请输入注册资本", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" }
        ],
        enterpriseLegalPerson: [
          { required: true, message: "请输入企业法人", trigger: "blur" }
        ],
        contactPosition: [{}],
        contactDepartment: [{}],
        enterPark: [{}],
        registrationTime: [{}],
        enterpriseIntroduction: [{}]
      },
      enterpriseFormVisible: false,
      enterpriseDetailVisible: false,
      parkList: [],
      industryTypeList: [],
      submitLoading: false
    };
  },
  methods: {
    getOptionName(key) {
      switch (key) {
        case "enterpriseId":
          return "企业ID";
        case "enterpriseName":
          return "企业名称";
        case "status":
          return "企业状态";
        case "enterpriseNature":
          return "企业性质";
        case "enterTime":
          return "入驻时间";
        case "officeAddress":
          return "办公地址";
        case "enterpriseLegalPerson":
          return "企业法人";
        case "registrationTime":
          return "注册时间";
        case "contact":
          return "联系人";
        case "contactTel":
          return "联系人电话";
        case "contactDepartment":
          return "联系人部门";
        case "contactPosition":
          return "联系人职位";
        case "enterpriseEmail":
          return "企业邮箱";
        case "registeredCapital":
          return "注册资金";
        case "industryTypeId":
          return "行业类型ID";
        case "industryTypeName":
          return "行业类型";
        case "enterpriseArea":
          return "企业所属地区";
        case "businessRegistrationType":
          return "工商注册类型";
        case "enterPark":
          return "入驻园区ID";
        case "recordDate":
          return "登记日期";
        case "contractType":
          return "合同类型";
        case "enterpriseIntroduction":
          return "企业简介";
        case "enterpriseTel":
          return "企业电话";
        case "spaceName":
          return "入驻园区";
      }
    },
    getTagType() {
      switch (this.enterpriseForm.status) {
        case "正常":
          return "success";
        case "筹建":
          return "warning";
        case "在建":
          return "warning";
        case "投产":
          return "primary";
        case "退园":
          return "info";
      }
    },
    resetTableData() {
      this.searchKey = "";
      this.getTableData();
    },
    getTableData() {
      this.tableLoading = true;
      EnterpriseApi.getEnterpriseTableData({
        currentPage: this.currentPage,
        limit: this.limit
      })
        .then(response => {
          let code = response.data.responseCode;
          if (code === 200) {
            this.tableData = response.data.tableData;
            this.total = response.data.total;
          }
          this.tableLoading = false;
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
    },
    handleUpdateEnterprise(row) {
      console.log(row);
      this.getParkSelect();
      this.getIndustryTypeSelect();
      EnterpriseApi.getEnterpriseDetail({
        enterpriseId: row.enterpriseId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.enterpriseForm = response.data.enterpriseData;
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
      this.enterpriseFormVisible = true;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    handleShowDetail(row) {
      EnterpriseApi.getEnterpriseDetail({
        enterpriseId: row.enterpriseId
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.enterpriseForm = response.data.enterpriseData;
            console.log(this.enterpriseForm);
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
      this.enterpriseDetailVisible = true;
    },
    getParkSelect() {
      SpaceApi.getParkSelect()
        .then(response => {
          if (response.data.responseCode === 200) {
            this.parkList = response.data.parkList;
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
    handleParkSelectChange() {},
    closeFormModal() {
      this.$refs.enterpriseForm.resetFields();
      this.enterpriseForm.enterpriseId = "";
      this.enterpriseForm.contactPosition = "";
      this.enterpriseForm.contactDepartment = "";
      this.enterpriseForm.enterpriseIntroduction = "";
      this.enterpriseForm.enterPark = "";
      this.enterpriseForm.registrationTime = "";
      this.enterpriseFormVisible = false;
    },
    submitForm() {
      this.$refs["enterpriseForm"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          EnterpriseApi.updateEnterprise({
            enterprise: this.enterpriseForm
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
              this.getTableData();
              this.submitLoading = false;
              this.closeFormModal();
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
      EnterpriseApi.getEnterpriseListByKey({
        key: this.searchKey
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.tableData = response.data.tableData;
            this.total = response.data.total;
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
    }
  },
  mounted() {
    this.getTableData();
  }
};
</script>

<style scoped>
/deep/ .el-tabs__item {
  font-size: 24px !important;
}
</style>
