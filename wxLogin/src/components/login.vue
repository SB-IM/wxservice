<template>
  <div>
    <div class="box">
      <p class="logo">Login</p>
      <ul class="go">
        <li>
          <p>账号</p>
          <van-field v-model="username" placeholder="请输入账号" />
        </li>
        <li>
          <p>密码</p>
          <van-field type="password" v-model="password" placeholder="请输入密码" />
        </li>
      </ul>
      <van-button @click="login" type="primary" size="large">登录并绑定此微信</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  created() {
    let url = window.location.href;
    if (url.split("?").length == 1) {
      let redirect_uri = `https://www.funnywork.com/openid`; // 回调地址，后端授权接口
      let appID = require("../config.json").appid;
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    } else {
      let openid = url.split("?")[1].split("=")[1];
      this.openid = openid;
      console.log(`openid`, openid);
    }
  },
  methods: {
    login() {
      const _this = this;
      if (!_this.username) {
        _this.$toast(`账号不能为空`);
      } else if (!_this.password) {
        _this.$toast(`密码不能为空`);
      } else {
        _this.$dialog
          .confirm({
            message: "确认登录既表示同意账户绑定当前微信账号"
          })
          .then(() => {
            // on confirm
            _this.$http
              .post(_this.$URL("/login"), {
                username: _this.username,
                password: _this.password
              })
              .then(res => {
                console.log(res.data);
                if (res.data.code == "1") {
                  _this.$toast(res.data.msg);
                } else {
                  _this.$toast(res.data.msg);
                }
              });
          })
          .catch(() => {
            // on cancel
          });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
  width: 90vw;
  padding: 0.8rem 0.3rem;
  margin: 1rem auto 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #f0f0f0;
}
.logo {
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  /* padding-top: 1rem */
}
.go {
  margin-top: 0.3rem;
}
.go li {
  display: flex;
  font-size: 0.34rem;
  align-items: center;
  /* padding:0 0.3rem; */
  margin-top: 0.3rem;
}
.go li p {
  white-space: nowrap;
  margin-right: 0.3rem;
}
.van-button {
  margin-top: 0.5rem;
}
</style>
