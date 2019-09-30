// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
Vue.prototype.$http = axios;
Vue.config.productionTip = false
import VueAMap from 'vue-amap';
import { Field } from 'vant';
import 'vant/lib/field/style';
import { Button } from 'vant';
import 'vant/lib/button/style';
import { Dialog } from 'vant';
import 'vant/lib/dialog/style';
import { Toast } from 'vant';
import 'vant/lib/toast/style';
Vue.use(Toast);
// 全局注册
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Field);
Vue.use(VueAMap);

// 手机适配
var deviceWidth =
document.documentElement.clientWidth > 750
? 750
: document.documentElement.clientWidth;
document.documentElement.style.fontSize = deviceWidth / 7.5 + "px";

//封装域名
Vue.prototype.$URL=function(url){
  let post=require('./config.json').POST
  return post + url
}

/* eslint-disable no-new */
let AMAP_KEY=require('./config.json').AMAP_KEY
VueAMap.initAMapApiLoader({
  key: AMAP_KEY,
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  v: '1.4.4'
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

