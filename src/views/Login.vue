<template>
  <div id="login">
    <el-row class="login-block">
      <el-col :span="8">
        <LoginFrame class="login-frame"></LoginFrame>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import LoginFrame from "@/components/LoginFrame";
export default {
  name: "Login",
  components: {
    LoginFrame
  },
  data() {
    return {};
  },
  methods: {},
  mounted: function() {}
};
</script>

<style scoped>
#login {
  background-image: url("../assets/loginbackground.jpg");
  height: 100vh;
  background-size: cover;
  background-position: center;
  -webkit-font-smoothing: antialiased;
}
.login-frame {
  width: 100%;
  height: 100%;
  min-width: 330px;
  min-height:40px;
}
.login-block{
  position: absolute;
  left: 50%;
  top:40%;
  display: flex;
  transform:translate(-50%,-50%)
}


</style>
