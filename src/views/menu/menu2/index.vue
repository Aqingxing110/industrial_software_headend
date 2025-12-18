<template>
  <!-- <button class="btn-default" type="button" @click="moveToEast">Move to the right</button> -->
  <ol-map>
    <ol-view ref="view" :center="center" :zoom="zoom" :projection="projection" />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>
    <div class="topbar">
      <span class="span" v-html="datetime.nowTime" />
      <span class="span">Total Vessels:</span>
      <span class="span">Unregistered Vessels:</span>
      <span class="span">Pending Alerts:</span>
    </div>
    <!-- <div class="div">1</div> -->
    <el-card class="box-card div">
      <template #header>
        <div class="card-header">
          <span>Vessel Information</span>
          <el-button class="button" text>Operation button</el-button>
        </div>
      </template>
      <!-- <div v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</div> -->
      <div class="text">
        <img src="/src/assets/vessel-01.jpg" width="300" height="150" />
        <br />
        <span>SLF Camera Picture</span>
      </div>
      <ul>
        <li>Vessel ID: G45F</li>
        <li>State: Registered</li>
        <li>Longitude and Latitude:</li>
        <li>Draft Depth:</li>
        <br />
        <li>
          Berth Information:
          <el-tag type="success" effect="plain">Passed</el-tag>
        </li>
        <li>Berth Port: NO.8</li>
      </ul>
      <div>
        <el-table :data="tableData" style="width: 100%" :cell-style="cellStyle">
          <el-table-column prop="name" label="Risk Alert Issue" width="252" />
          <el-table-column fixed="right" label="Operations" width="108">
            <template #default>
              <el-button link type="primary" size="small" @click="handleSend">send</el-button>
              <el-button link type="primary" size="small" @click="handleDetail">detail</el-button>
              <!-- <el-button link type="primary" size="small">Edit</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <br />
      <div>
        <!-- <el-table :data="tableData" style="width: 100%" :cell-style="cellStyle">
          <el-table-column prop="name" label="Risk Alert Issue" width="252" />
          <el-table-column fixed="right" label="Operations" width="108">
            <template #default>

            </template>
          </el-table-column>
        </el-table> -->
      </div>
    </el-card>
    <!-- <ol-overlay :position="[item + 116 + offset, 23.1]" v-for="item in list" :key="item">
      <div class="overlay-content">
        {{ item }}
      </div>
    </ol-overlay> -->
  </ol-map>

  <el-dialog v-model="dialogDetail" :title="'Details of the Alet'" width="30%" />
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { reactive } from "vue"
const center = ref([116, 23])
const projection = ref("EPSG:4326")
const zoom = ref(8)
const datetime = reactive({ nowTime: "" })
//顶部时间
const getTime = () => {
  const myDate = new Date()
  const myYear = myDate.getFullYear() //获取完整的年份(4位,1970-????)
  const myMonth = myDate.getMonth() + 1 //获取当前月份(0-11,0代表1月)
  const myToday = myDate.getDate() //获取当前日(1-31)
  const myDay = myDate.getDay() //获取当前星期X(0-6,0代表星期天)
  const myHour = myDate.getHours() //获取当前小时数(0-23)
  const myMinute = myDate.getMinutes() //获取当前分钟数(0-59)
  const mySecond = myDate.getSeconds() //获取当前秒数(0-59)
  const week = ["Sun.", "Mon.", "Tues.", "Wed.", "Thur.", "Fri.", "Sat."]

  datetime.nowTime =
    myYear +
    "." +
    fillZero(myMonth) +
    "." +
    fillZero(myToday) +
    "." +
    "&nbsp;&nbsp;" +
    fillZero(myHour) +
    ":" +
    fillZero(myMinute) +
    ":" +
    fillZero(mySecond) +
    "&nbsp;&nbsp;" +
    week[myDay] +
    "&nbsp;&nbsp;"
}
const fillZero = (str) => {
  let realNum
  if (str < 10) {
    realNum = "0" + str
  } else {
    realNum = str
  }
  return realNum
}
//大屏
setInterval(getTime, 1000)

// function moveToEast() {
//   offset.value += 0.1
// }

const dialogDetail = ref<boolean>(false)
const handleDetail = () => {
  console.log("Detail")
  dialogDetail.value = true
}

const handleSend = () => {
  console.log("Send")
}

const tableData = [
  {
    name: "Jul 18:30:58 weather alert"
  },
  {
    name: "Jul 18:28:45 Collsion alert"
  }
  // {
  //   name: "Tom"
  // },
  // {
  //   name: "Tom"
  // }
]
//row, column, rowIndex,
const cellStyle = ({ columnIndex }) => {
  // 状态列字体颜色
  // columnIndex 列下标
  // rowIndex 行下标
  // row 行
  // column 列
  if (columnIndex === 0) {
    return { color: "	#FF0000" }
  }
}
</script>

<style scoped>
.div {
  /* width: 200px; */
  /* height: 600px; */
  height: 500px;
  overflow: scroll;
  background-color: rgba(255, 255, 255, 0.5);
  position: fixed;
  z-index: 99;
  top: 150px;
  right: 120px;
  border-radius: 20px;
  font-size: 16px;
}

.topbar {
  width: 60%;
  height: 30px;
  line-height: 30px;
  background-color: rgba(255, 255, 255, 0.7);
  position: fixed;
  z-index: 99;
  top: 110px;
  left: 20%;
  border-radius: 20px;
  font-size: 17px;
}

.span {
  padding: 3%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 16px;
  text-align: center;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 340px;
}
</style>
