<template>
  <div>
    <el-row align="center">
      <el-col :span="4">
        <el-card :body-style="{ padding: '30px' }">
          <div>
            <el-avatar :size="60">项</el-avatar>
          </div>
          <div class="card-word">
            项目中心
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ProjectCenter"
};
</script>

<style scoped>
.card-word {
  width: 100%;
  padding: 20px 0;
  text-align: center;
}
</style>
