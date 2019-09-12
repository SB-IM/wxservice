<template>
  <div>
    <div class="amap-page-container">
      <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager" :center="center"  :plugin="plugin" :events="events" class="amap-demo">
          <el-amap-polyline :editable="polyline.editable"  :path="polyline.path" ></el-amap-polyline>
      </el-amap>

      <div class="toolbar">
        <button @click="getMap()">get map</button>
      </div>
    </div>
  </div>
</template>

<script>
import VueAMap from "vue-amap";
export default {
  data() {
    return {
      amapManager: new VueAMap.AMapManager(),
    
          center: [113.266749,23.135841],
          events: {
            init: (o) => {
              console.log(o.getCenter())
              console.log(this.$refs.map.$$getInstance())
              o.getCity(result => {
                console.log(result)
              })
            },
            'moveend': () => {
            },
            'zoomchange': () => {
            },
            'click': (e) => {
              alert('map clicked');
            }
          },
          plugin: ['ToolBar', {
            pName: 'MapType',
            defaultType: 0,
            events: {
              init(o) {
                console.log(o);
              }
            }
          }],
          polyline: {
            path: [[113.266749,23.135841],[113.366749,23.135841],[113.366749,23.435841],[113.566749,23.435841]],
            events: {
              click(e) {
                alert('click polyline');
              },
              end: (e) => {
                let newPath = e.target.getPath().map(point => [point.lng, point.lat]);
                console.log(newPath);
              }
            },
          }
    };
  },
  methods: {
        getMap() {
          // amap vue component
          console.log(this.amapManager._componentMap);
          // gaode map instance
          console.log(this.amapManager._map);
        }
      },
  created() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.amap-demo {
  width: 100vw;
  height: 40vh;
}
</style>
