<template>
  <div class="full-height">
    <div class="content-block">
      <el-row :gutter="30" style="height:100%">
        <el-col :span="8" class="full-height">
          <MessageBlock block-title="待办"></MessageBlock>
        </el-col>
        <el-col :span="8" class="full-height">
          <MessageBlock block-title="已办"></MessageBlock>
        </el-col>
        <el-col :span="8" class="full-height">
          <MessageBlock block-title="其他"></MessageBlock>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import MessageBlock from "@/components/MessageBlock";
import MessageApi from "@/api/MessageApi";
export default {
  name: "ApprovalMessage",
  components: { MessageBlock },
  data() {
    return {
      waitingTaskList: [],
      completeTaskList: [],
      otherTaskList: []
    };
  },
  methods: {
    mountData() {}
  },
  mounted() {
    this.mountData();
  }
};
</script>

<style scoped></style>
