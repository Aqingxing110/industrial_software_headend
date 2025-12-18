import { createPinia } from "pinia"
import { ref, reactive } from "vue"

const store = createPinia()

export default store

import { defineStore } from "pinia"

interface Mylocation {
  vno: string
  latitude: string
  longitude: string
  state: number
  arrtime: string
}
interface AISlocation {
  course: number
  heading: number
  latitude: number
  longitude: number
  mmsi: string
  shipname: string
  speed: number
  state: number
  arrtime: string
}

export const useLocationStore = defineStore({
  id: "location",
  state: () => ({
    locationArr: [] as Mylocation[]
  }),
  actions: {
    // 更新 locationArr 的 action (gps的)
    updateLocationArr(newArr: Mylocation[]) {
      this.locationArr = newArr
    }
  }
})

export const useAISStore = defineStore({
  id: "AIS",
  state: () => ({
    AISArr: [] as AISlocation[]
  }),
  actions: {
    // 更新 AISArr 的 action
    updateAISArr(newArr: AISlocation[]) {
      this.AISArr = newArr
    }
  }
})

export const useAddOneStore = defineStore({
  id: "AddOne",
  state: () => ({
    AddOne: 0
  }),
  actions: {
    // 更新
    updateAddOne(number) {
      this.AddOne = number
    }
  }
})

export const useSpeakerStore = defineStore("Speaker", () => {
  // const count = ref(0)
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }
  const speakerCount = ref(0)
  const bridgeName = ref("LB1")

  return { speakerCount, bridgeName }
})

export const useSensorStore = defineStore("Sensor", () => {
  const thistime = ref("time")
  const chartDataS1 = reactive<{ time: string; value: number }[]>([])
  const chartDataS2 = reactive<{ time: string; value: number }[]>([])
  const chartDataS3 = reactive<{ time: string; value: number }[]>([])
  const chartDataS4 = reactive<{ time: string; value: number }[]>([])
  const chartDataS5 = reactive<{ time: string; value: number }[]>([])
  const chartDataS6 = reactive<{ time: string; value: number }[]>([])
  const chartDataS7 = reactive<{ time: string; value: number }[]>([])
  const chartDataS8 = reactive<{ time: string; value: number }[]>([])

  return {
    thistime,
    chartDataS1,
    chartDataS2,
    chartDataS3,
    chartDataS4,
    chartDataS5,
    chartDataS6,
    chartDataS7,
    chartDataS8
  }
})

export const useReminderStore = defineStore("Reminder", () => {
  const reminderCount = ref(0)
  const reminderType = ref("reminder")
  const reminderTime = ref(-1)
  const reminderState = ref(-1)
  const reminderVno = reactive<string[]>(["xxx"]) // 明确声明为字符串数组
  const reminderBridge = ref("B")

  return { reminderCount, reminderType, reminderTime, reminderState, reminderVno, reminderBridge }
})

export const useLB1ReminderStore = defineStore("LB1Reminder", () => {
  const LB1ReminderCountPass = ref(0)
  const LB1ReminderCountUnPass = ref(0)
  const LB1ReminderType = ref("reminder") //肯定都是reminder
  const LB1ReminderTime = ref(-1) //15 10 5 0
  const LB1ReminderStatePass = ref(-1)
  const LB1ReminderStateUnPass = ref(-1)
  const LB1ReminderLightPass = ref(-1)
  const LB1ReminderLightUnPass = ref(-1)
  const LB1ReminderGatePass = ref(-1)
  const LB1ReminderGateUnPass = ref(-1)
  const LB1ReminderDeVesselPass = ref(-1)
  const LB1ReminderDeVesselUnPass = ref(-1)
  const LB1ReminderDePedestPass = ref(-1)
  const LB1ReminderDePedestUnPass = ref(-1)
  const LB1ReminderOpenedPass = ref(-1)
  const LB1ReminderOpenedUnPass = ref(-1)
  const LB1ReminderVnoPass = reactive<string[]>(["xxx"])
  const LB1ReminderVnoUnPass = reactive<string[]>(["477996866"])
  const LB1ReminderBridge = ref("LB1")

  return {
    LB1ReminderCountPass,
    LB1ReminderCountUnPass,
    LB1ReminderType,
    LB1ReminderTime,
    LB1ReminderStatePass,
    LB1ReminderStateUnPass,
    LB1ReminderLightPass,
    LB1ReminderLightUnPass,
    LB1ReminderGatePass,
    LB1ReminderGateUnPass,
    LB1ReminderDeVesselPass,
    LB1ReminderDeVesselUnPass,
    LB1ReminderDePedestPass,
    LB1ReminderDePedestUnPass,
    LB1ReminderOpenedPass,
    LB1ReminderOpenedUnPass,
    LB1ReminderVnoPass,
    LB1ReminderVnoUnPass,
    LB1ReminderBridge
  }
})

export const useMB1ReminderStore = defineStore("MB1Reminder", () => {
  const MB1ReminderCountPass = ref(0)
  const MB1ReminderCountUnPass = ref(0)
  const MB1ReminderType = ref("reminder") //肯定都是reminder
  const MB1ReminderTime = ref(-1) //15 10 5 0
  const MB1ReminderStatePass = ref(-1)
  const MB1ReminderStateUnPass = ref(-1)
  const MB1ReminderLightPass = ref(-1)
  const MB1ReminderLightUnPass = ref(-1)
  const MB1ReminderGatePass = ref(-1)
  const MB1ReminderGateUnPass = ref(-1)
  const MB1ReminderDeVesselPass = ref(-1)
  const MB1ReminderDeVesselUnPass = ref(-1)
  const MB1ReminderDePedestPass = ref(-1)
  const MB1ReminderDePedestUnPass = ref(-1)
  const MB1ReminderOpenedPass = ref(-1)
  const MB1ReminderOpenedUnPass = ref(-1)
  const MB1ReminderVnoPass = reactive<string[]>(["xxx"])
  const MB1ReminderVnoUnPass = reactive<string[]>(["yyy", "zzz"])
  const MB1ReminderBridge = ref("MB1")

  return {
    MB1ReminderCountPass,
    MB1ReminderCountUnPass,
    MB1ReminderType,
    MB1ReminderTime,
    MB1ReminderStatePass,
    MB1ReminderStateUnPass,
    MB1ReminderLightPass,
    MB1ReminderLightUnPass,
    MB1ReminderGatePass,
    MB1ReminderGateUnPass,
    MB1ReminderDeVesselPass,
    MB1ReminderDeVesselUnPass,
    MB1ReminderDePedestPass,
    MB1ReminderDePedestUnPass,
    MB1ReminderOpenedPass,
    MB1ReminderOpenedUnPass,
    MB1ReminderVnoPass,
    MB1ReminderVnoUnPass,
    MB1ReminderBridge
  }
})

export const useMB2ReminderStore = defineStore("MB2Reminder", () => {
  const MB2ReminderCountPass = ref(0)
  const MB2ReminderCountUnPass = ref(0)
  const MB2ReminderType = ref("reminder") //肯定都是reminder
  const MB2ReminderTime = ref(-1) //15 10 5 0
  const MB2ReminderStatePass = ref(-1)
  const MB2ReminderStateUnPass = ref(-1)
  const MB2ReminderLightPass = ref(-1)
  const MB2ReminderLightUnPass = ref(-1)
  const MB2ReminderGatePass = ref(-1)
  const MB2ReminderGateUnPass = ref(-1)
  const MB2ReminderDeVesselPass = ref(-1)
  const MB2ReminderDeVesselUnPass = ref(-1)
  const MB2ReminderDePedestPass = ref(-1)
  const MB2ReminderDePedestUnPass = ref(-1)
  const MB2ReminderOpenedPass = ref(-1)
  const MB2ReminderOpenedUnPass = ref(-1)
  const MB2ReminderVnoPass = reactive<string[]>(["xxx"])
  const MB2ReminderVnoUnPass = reactive<string[]>(["yyy", "zzz"])
  const MB2ReminderBridge = ref("MB2")

  return {
    MB2ReminderCountPass,
    MB2ReminderCountUnPass,
    MB2ReminderType,
    MB2ReminderTime,
    MB2ReminderStatePass,
    MB2ReminderStateUnPass,
    MB2ReminderLightPass,
    MB2ReminderLightUnPass,
    MB2ReminderGatePass,
    MB2ReminderGateUnPass,
    MB2ReminderDeVesselPass,
    MB2ReminderDeVesselUnPass,
    MB2ReminderDePedestPass,
    MB2ReminderDePedestUnPass,
    MB2ReminderOpenedPass,
    MB2ReminderOpenedUnPass,
    MB2ReminderVnoPass,
    MB2ReminderVnoUnPass,
    MB2ReminderBridge
  }
})
