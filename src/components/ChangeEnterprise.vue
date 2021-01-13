<template>
  <div class="full-width full-height">
    <el-row>
      <el-col>
        <el-input
          type="text"
          prefix-icon="el-icon-search"
          v-model="searchKey"
          @input="searchByKey"
          class="full-width"
          clearable
        ></el-input>
      </el-col>
    </el-row>
    <div class="title-padding-bottom"></div>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      width="80%"
      border
      highlight-current-row
      @current-change="handleEnterpriseChange"
    >
      <el-table-column label="企业名称" prop="enterpriseName"></el-table-column>
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
</template>

<script>
import EnterpriseApi from "@/api/EnterpriseApi";

export default {
  name: "ChangeEnterprise",
  data() {
    return {
      enterprises: [],
      searchKey: "",
      tableData: [],
      limit: 10,
      currentPage: 1,
      total: 0,
      tableLoading: false
    };
  },
  methods: {
    searchByKey() {
      this.tableLoading = true;
      EnterpriseApi.getEnterpriseComponentTableDataByKey({
        searchKey: this.searchKey
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
    handleEnterpriseChange(val) {
      this.$emit("enterprise-change", val);
    },

    getTableData() {
      this.tableLoading = true;
      EnterpriseApi.getEnterpriseComponentTableData({
        currentPage: this.currentPage,
        limit: this.limit
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
    handleSizeChange(val) {
      this.limit = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    }
  },
  mounted() {
    this.getTableData();
  }
};
</script>

<style scoped></style>
