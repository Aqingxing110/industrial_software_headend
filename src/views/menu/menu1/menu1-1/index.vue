<script lang="ts" setup>
import { onMounted } from "vue"

defineOptions({
  name: "Menu1-1"
})

onMounted(() => {
  const basemapAPI = "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/basemap/wgs84/{z}/{x}/{y}.png"
  const attributionInfo =
    '<a href="https://api.portal.hkmapservice.gov.hk/disclaimer" target="_blank" class="copyrightDiv">&copy; 地圖資料由地政總署提供</a><div style="width:28px;height:28px;display:inline-flex;background:url(https://api.hkmapservice.gov.hk/mapapi/landsdlogo.jpg);background-size:28px;"></div>'
  const map = new ol.Map({
    controls: ol.control.defaults({ attribution: false }).extend([new ol.control.Attribution({ collapsible: false })]),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: basemapAPI,
          attributions: new ol.Attribution({
            html: attributionInfo
          })
        })
      })
    ],
    target: "map",
    logo: false,
    view: new ol.View({
      center: ol.proj.fromLonLat([114.20847, 22.29227]),
      zoom: 17,
      minZoom: 10,
      maxZoom: 20
    })
  })
})
</script>

<template>
  <div id="map" class="map" />
</template>

<style scoped>
@import url(./v4.6.5-dist/ol.css);

html,
body,
#map {
  padding: 0 0;
  margin: 0 0;
  width: 100%;
  height: 100%;
}
.ol-attribution.ol-uncollapsible {
  bottom: 12px;
  background: transparent;
}
.ol-attribution ul {
  font-size: 12px;
  font-family: sans-serif;
}
.ol-attribution a {
  color: black;
}
.copyrightDiv {
  display: inline-block;
  height: 1rem;
  line-height: 1rem;
  position: absolute;
  top: 50%;
  bottom: 5px;
  right: 40px;
  margin: 0 5px 0 0;
  padding: 0 4px;
  font-family: sans-serif;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  color: #333;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 1;
}
</style>
