<template>
  <div class="container-fluid">
    <el-container>
      <el-header class="header">
        <el-menu
          class="el-menu"
          mode="horizontal"
          @select="handleSelect"
          background-color="#444a50"
          text-color="#fff"
          active-text-color="#fff"
          router
        >
          <el-menu-item class="system-name" index="/main"
            >智慧园区招商管理系统</el-menu-item
          >
          <div>
            <el-submenu index="2" class="user-logo">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                {{ user }}
              </template>
              <el-menu-item index="0-1">用户设置</el-menu-item>
              <el-menu-item index="0-2" @click="logout">退出</el-menu-item>
            </el-submenu>
          </div>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="210px">
          <el-menu
            class="el-menu-vertical"
            text-color="#fff"
            active-text-color="#ffd04b"
            default-active="0"
            background-color="#545c64"
            :unique-opened="true"
            router
          >
            <div v-for="(item, i) in menu" :key="item.num">
              <el-submenu
                v-if="
                  item.status !== '隐藏' &&
                    (item.nodes !== undefined || item.nodes.length > 0)
                "
                :index="generateIndex(i)"
                class="submenu"
              >
                <template
                  slot="title"
                  v-if="item.menuName === '消息中心' && messageCount !== 0"
                >
                  <el-badge
                    :value="messageCount"
                    :max="99"
                    class="el-badge-item"
                  >
                    <div class="badge-item">
                      <i :class="item.icon" size="large"></i>
                    </div>
                  </el-badge>
                  {{ item.menuName }}
                </template>

                <template slot="title" v-else>
                  <i :class="item.icon"></i>
                  {{ item.menuName }}
                </template>
                <div v-for="(node, j) in item.nodes" :key="node.num">
                  <el-menu-item
                    v-if="
                      node.status !== '隐藏' &&
                        (node.nodes === undefined || node.nodes.length === 0)
                    "
                    :index="generateIndex(node.menuPath)"
                    class="submenu-item"
                    style="padding-left: 60px;"
                  >
                    {{ node.menuName }}
                  </el-menu-item>
                  <el-submenu
                    :index="generateIndex(i + '-' + j)"
                    class="submenu"
                    style="font-size: small"
                    v-else-if="node.status !== '隐藏'"
                  >
                    <template slot="title">
                      <i :class="node.icon"></i>
                      {{ node.menuName }}
                    </template>
                    <div v-for="child in node.nodes" :key="child.num">
                      <el-menu-item
                        v-if="child.status !== '隐藏'"
                        :index="generateIndex(child.menuPath)"
                        class="submenu-item"
                      >
                        {{ child.menuName }}
                      </el-menu-item>
                    </div>
                  </el-submenu>
                </div>
              </el-submenu>
              <el-menu-item
                :index="generateIndex(item.menuPath)"
                class="submenu-item"
                v-else-if="item.status !== '隐藏'"
              >
                {{ item.menuName }}
              </el-menu-item>
            </div>
          </el-menu>
        </el-aside>
        <el-main style="height: 100%">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MenuApi from "@/api/MenuApi";
import MessageApi from "@/api/MessageApi";

export default {
  name: "Main",
  data() {
    return {
      menu: "",
      user: "",
      messageCount: 0,
      websocket: "",
      lockReconnect: false, //是否真正建立连接
      timeout: 30 * 1000, //30秒一次心跳
      timeoutObj: null, //心跳的心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null, //断开重连倒计时
      messageList: [],
      messageValue: ""
    };
  },
  methods: {
    handleSelect() {},
    toPage(event) {
      this.$router.toLocaleString("/IndustryTypeManagement");
    },
    logout() {
      localStorage.removeItem("Authorization");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("menu");
      this.$router.push("/login");
      this.$message({
        showClose: true,
        message: "登出成功",
        type: "success"
      });
    },
    generateIndex(index) {
      return "" + index;
    },
    generateRoute(route) {
      return route;
    },
    generateMessageCount() {
      let usr = JSON.parse(localStorage.getItem("userInfo"));
      MessageApi.generateMessageCountData({
        username: usr.username,
        positionId: usr.positionId
      })
        .then(response => {
          if (response.data.responseCode == 200) {
            this.messageCount = response.data.messageCount;
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
    conectWebSocket() {
      console.log("准备建立连接");
      if (this.user === undefined || this.user === "") {
        return;
      }
      if ("WebSocket" in window) {
        console.log("建立连接");
        this.websocket = new WebSocket(
          "ws://localhost:8081/webSocket/" + this.user
        );
        this.initWebSocket();
        console.log("连接创建完毕");
      } else {
        this.$message({
          showClose: true,
          message: "不支持建立socket连接",
          type: "error"
        });
      }
    },
    initWebSocket() {
      //连接发生错误时的回调方法
      this.websocket.onerror = this.onError;

      //连接成功建立时的回调方法
      this.websocket.onopen = this.onOpen;

      //接受到消息的回调方法
      this.websocket.onmessage = this.onMessage;
      //连接关闭的回调方法
      this.websocket.onclose = this.onClose;
    },
    onOpen() {
      console.log("【WebSocket】连接成功");
      this.websocket.send(1);
      this.start();
    },
    onError() {
      console.log("【WebSocket】发生错误");
      this.reconnect();
    },
    onMessage(e) {
      let data = JSON.parse(e.data);
      console.log("【WebSocket】收到服务端消息");
      console.log(data);
      switch (data.type) {
        case "updateMessageCount":
          this.messageCount = data.messageCount;
          break;
      }
      this.reset();
    },
    onClose(e) {
      console.log("【WebSocket】断开连接", e);
      this.reconnect();
    },
    reconnect() {
      let that = this;
      if (this.lockReconnect) {
        return;
      }
      this.lockReconnect = true;
      //没连接上会一直重连,设置延迟避免请求过多
      this.timeoutnum && clearTimeout(this.timeoutnum);
      this.timeoutnum = setTimeout(() => {
        this.conectWebSocket();
        this.lockReconnect = false;
      }, 5000);
    },
    reset() {
      //重置心跳
      //清除时间
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      //重启心跳
    },
    start() {
      this.timeoutObj && clearTimeout(this.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setTimeout(() => {
        //这里发送一个心跳,后端收到后,返回一个心跳消息
        if (this.websocket.readyState === 1) {
          //连接正常
          this.websocket.send(JSON.stringify("heartCheck"));
        } else {
          //否则重连
          this.reconnect();
        }
        this.serverTimeoutObj = setTimeout(() => {
          this.websocket.close();
        }, this.timeout);
      }, this.timeout);
    },
    wsSend() {},
    sendMessage() {
      let msg = { msg: "1", toUser: "admin" };
      this.websocket.send(JSON.stringify(msg));
    }
  },
  mounted() {
    this.conectWebSocket();
    this.generateMessageCount();
  },

  created() {
    this.user = JSON.parse(localStorage.getItem("userInfo")).username;
    MenuApi.getUserMenu().then(response => {
      let code = response.data.responseCode;
      switch (code) {
        case 200:
          this.menu = response.data.menuTree;
          sessionStorage.setItem(
            "menu",
            JSON.stringify(response.data.menuTree)
          );
          break;
        case 400:
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: "error"
          });
          break;
      }
    });
  },
  beforeDestroy() {
    this.websocket.close();
  }
};
</script>

<style scoped>
body {
  width: 100%;
}
.user-menu {
  float: right;
}
.el-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.header {
  height: 10%;
  padding: 0;
}
.user-logo {
  float: right;
  right: 25px;
}
.system-name {
  font-family: "PingFang SC";
  color: #898888;
  font-size: 20px;
}
.el-menu-vertical {
  width: 200px;
  height: 100%;
}
.container-fluid {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.menu-title {
  padding-left: 0;
}
.submenu {
  padding-left: -20px;
}
.color {
  color: #444a50;
}
a {
  color: #ffffff;
  text-decoration: none;
}
.router-link-active {
  color: #ffd04b;
}
</style>
<style>
.submenu-item {
  padding-left: 20px;
}
</style>
