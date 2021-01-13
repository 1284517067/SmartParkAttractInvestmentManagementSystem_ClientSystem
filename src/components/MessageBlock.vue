<template>
  <div class="full-height full-width">
    <div class="message-card" :class="switchCardTheme(title)">
      <div class="message-card-title">{{ title }}事项</div>
      <div class="message-card-count">
        {{ count }}
      </div>
    </div>
    <div class="padding"></div>
    <div class="message-list-block">
      <div class="message-list-block-header">
        <div class="message-list-block-title">{{ title }}事项</div>
        <el-button
          type="text"
          class="message-list-block-refresh-button"
          @click.native="refreshData"
        >
          <i :class="buttonStatus ? 'el-icon-loading' : 'el-icon-refresh'"></i>
        </el-button>
      </div>
      <div class="message-list-block-body">
        <div v-if="messages.length === 0" class="full-height">
          <div class="message-list-empty">
            <el-image :src="require('@/assets/empty.png')"></el-image>
            <div>暂无事项</div>
          </div>
        </div>
        <div class="full-height" v-else>
          <div
            class="message-list-item"
            v-for="item in messages"
            :key="item.num"
          >
            <el-tooltip placement="top" effect="dark" :content="item.message">
              <el-link
                size="small"
                type="info"
                class="message-list-item-title"
                :underline="false"
                icon="el-icon-tickets"
                @click="openMessage(item)"
                >{{ item.message }}</el-link
              >
            </el-tooltip>
            <div class="message-list-item-create-date">
              {{ item.applicant }}：{{ item.createDate }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      width="80%"
      modal
      show-close
      destroy-on-close
      :visible.sync="modalFormVisible"
    >
      <IntentionRegistrationForm
        :form-id="formId"
        :contract-type="contractType"
        v-if="contractType === '意向登记'"
      ></IntentionRegistrationForm>
      <IntentionAgreementComponent
        :form-id="formId"
        v-if="contractType === '意向协议'"
      >
      </IntentionAgreementComponent>
      <OpinionComponent
        :contract-type="contractType"
        :id="formId"
        :message-id="activeMessageId"
        :message-type="blockTitle"
      ></OpinionComponent>
    </el-dialog>
  </div>
</template>

<script>
import MessageApi from "@/api/MessageApi";
import ApprovalApi from "@/api/ApprovalApi";
import IntentionRegistrationForm from "@/components/approvalFormComponents/IntentionRegistrationForm";
import OpinionComponent from "@/components/approvalFormComponents/OpinionComponent";
import IntentionAgreementComponent from "@/components/approvalFormComponents/IntentionAgreementComponent";

export default {
  name: "MessageBlock",
  components: {
    IntentionAgreementComponent,
    OpinionComponent,
    IntentionRegistrationForm
  },
  props: ["blockTitle"],
  data() {
    return {
      title: this.blockTitle,
      messages: [],
      modalFormVisible: false,
      formId: "",
      contractType: "",
      activeMessageId: "",
      count: 0,
      buttonStatus: false
    };
  },
  methods: {
    async getMessages() {
      let user = JSON.parse(localStorage.getItem("userInfo"));
      await MessageApi.getMessagesData({
        username: user.username,
        positionId: user.positionId,
        type: this.title
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.messages = response.data.messages;
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
    openMessage(item) {
      this.formId = item.formId;
      this.contractType = item.contractType;
      this.activeMessageId = item.messageId;
      this.modalFormVisible = true;
    },
    closeModal() {},
    async getMessageCount() {
      let user = JSON.parse(localStorage.getItem("userInfo"));
      await MessageApi.getMessagesCountData({
        username: user.username,
        positionId: user.positionId,
        type: this.title
      })
        .then(response => {
          if (response.data.responseCode === 200) {
            this.count = response.data.count;
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
    switchCardTheme(type) {
      switch (type) {
        case "待办":
          return "message-card-theme1";
        case "已办":
          return "message-card-theme2";
        case "其他":
          return "message-card-theme3";
      }
    },
    async mountData() {
      await this.getMessages();
      await this.getMessageCount();
    },
    async refreshData() {
      this.buttonStatus = true;
      await this.mountData();
      setTimeout(() => (this.buttonStatus = false), 300);
    }
  },
  mounted() {
    this.mountData();
  }
};
</script>

<style scoped></style>
