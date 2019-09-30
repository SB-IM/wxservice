<template>
  <div>
    <div v-if="isWeiXin()" class="mask">
      <p class="text">请点击右上角，选择使用手机自带浏览器打开</p>
    </div>
    <div class="PresentationTitle">数据报告</div>
    <div class="textWord">
      <p class="title">文本内容:</p>
      <iframe class="text_url" src="http://www.baidu.com" frameborder="0"></iframe>
    </div>
    <div class="fileDownLoad">
      <p class="title">文件下载:</p>
      <a class="DonwnLoad" download href="@/assets/logo.png">点击下载tif文件</a>
    </div>
    <div class="amap-box">
      <p class="title">航线飞行轨迹:</p>
      <el-amap
        ref="map"
        vid="amap"
        :amap-manager="amapManager"
        :center="center"
        :plugin="plugin"
        :events="events"
        class="amap"
      >
        <el-amap-polyline
          :strokeColor="polyline.strokeColor"
          :editable="polyline.editable"
          :zIndex="polyline.zIndex"
          :geodesic="true"
          :path="polyline.path"
        ></el-amap-polyline>
      </el-amap>
    </div>
  </div>
</template>

<script>
import VueAMap from "vue-amap";
export default {
  data() {
    return {
      openid: "",
      amapManager: new VueAMap.AMapManager(),
      center: [114.224864, 22.687672],
      events: {
        init: o => {
          console.log(o.getCenter());
          console.log(this.$refs.map.$$getInstance());
          o.getCity(result => {
            console.log(result);
          });
        },
        moveend: () => {},
        zoomchange: () => {},
        click: e => {
          alert("map clicked");
        }
      },
      plugin: [
        {
          pName: "ToolBar"
        },
        {
          pName: "MapType",
          defaultType: 0,
          events: {
            init(o) {
              console.log(o);
            }
          }
        },
        {
          pName: "OverView"
          // isOpen:true//鹰眼是否打开
        },
        {
          pName: "Scale"
        }
      ],
      polyline: {
        path: [],
        zIndex: 1000,
        strokeColor: "#123456",
        events: {
          click(e) {
            alert("click polyline");
          },
          end: e => {
            let newPath = e.target
              .getPath()
              .map(point => [point.lng, point.lat]);
            console.log(newPath);
          }
        }
      }
    };
  },
  created() {
    let _this = this;
    let url = window.location.href;
    if (url.split("?").length == 1) {
      let redirect_uri = `https://www.funnywork.com/mapOpenid`; // 回调地址，后端授权接口
      let appID = require("../config.json").appid;
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    } else {
      let openid = url.split("?")[1].split("=")[1];
      this.openid = openid;
      console.log(`openid`, openid);
    }
    _this.polyline.path = [
      [114.224864, 22.687672],
      [114.2248576, 22.6876944],
      [114.2248448, 22.6877632],
      [114.2249216, 22.687696],
      [114.2250112, 22.6876544],
      [114.2249472, 22.6876128],
      [114.2249216, 22.6875536],
      [114.2248704, 22.6876032],
      [114.2247936, 22.6876464],
      [114.2247936, 22.8876464],
      [114.2247936, 22.9876464],
      [114.3247936, 22.9876464],
      [114.2247936, 22.3876464]
    ];
  },
  mounted() {
    this.getMsg();
  },
  methods: {
    //判断是否是微信浏览器的函数
    isWeiXin() {
      //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
      var ua = window.navigator.userAgent.toLowerCase();
      //通过正则表达式匹配ua中是否含有MicroMessenger字符串
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    getMsg() {
      this.$http.post("http://localhost:4000/login/login").then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.PresentationTitle {
  font-size: 0.8rem;
  text-align: center;
  padding: 0.2rem 0 0.8rem 0;
}
.amap-box {
  margin-top: 0.5rem;
}
.title {
  font-size: 0.4rem;
}
.amap {
  width: 100%;
  height: 40vh;
  margin-top: 0.1rem;
}
.DonwnLoad {
  width: 3rem;
  height: 0.8rem;
  display: block;
  line-height: 0.8rem;
  color: red;
  border: 1px solid black;
  background: #eee;
  font-size: 0.34rem;
  text-align: center;
}
.mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}
.mask .text {
  font-size: 0.6rem;
  color: white;
  padding: 0.5rem;
  margin-top: 0.2rem;
  letter-spacing: 0.05rem;
}
.textWord {
  font-size: 0.4rem;
}
.fileDownLoad {
  margin-top: 0.5rem;
}
.text_url {
  width: 100vw;
  height: 5rem;
}
</style>
