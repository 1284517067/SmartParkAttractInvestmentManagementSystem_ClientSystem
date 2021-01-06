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
        <el-main style="height: 100%" class="bg-light">
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
      messageCount: 0
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
    }
  },
  mounted() {
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
