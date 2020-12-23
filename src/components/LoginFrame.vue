<template>
  <div class="loginframe">
    <el-form :rules="rule" :model="form" :ref="form">
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <p class="login-title">WELCOME TO SMART PARK</p>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-form-item prop="username">
            <el-input
              type="text"
              v-model="form.username"
              class="loginInput"
              autocomplete="off"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user-solid"
              requried
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="form.password"
              class="loginInput"
              placeholder="请输入密码"
              autocomplete="off"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-button class="loginButton" type="success" @click="toLogin(form)"
            >登录</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import LoginApi from "@/api/LoginApi";
import { mapMutations } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      userToken: "",
      rule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapMutations(["changeLogin"]),
    toLogin(form) {
      /**
       * 登录逻辑
       * */

      this.$refs[form].validate(valid => {
        if (valid) {
          let that = this;
          LoginApi.login({
            username: this.form.username,
            password: this.form.password
          })
            .then(response => {
              let code = response.data.responseCode;
              switch (code) {
                case 200:
                  this.userToken = response.data.token;
                  this.changeLogin({ Authorization: that.userToken });
                  localStorage.setItem(
                    "userInfo",
                    JSON.stringify(response.data.userInfo)
                  );
                  this.$router.push("/main");
                  this.$message({
                    showClose: true,
                    message: "登录成功",
                    type: "success"
                  });
                  break;
              }
            })
            .catch(error => {
              this.$message({
                showClose: true,
                type: "error",
                message: error
              });
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.loginInput {
  margin-top: 20px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}
.loginButton {
  margin-top: 20px;
  width: 100%;
}
.login-title {
  width: 330px;
  margin: 0;
  font-family: "PingFang SC";
  font-size: 45px;
  color: #e7e7e7;
}
</style>
