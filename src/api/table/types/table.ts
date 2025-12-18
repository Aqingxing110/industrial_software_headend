// import { N, S } from "vitest/dist/reporters-cb94c88b"

export interface CreateTableRequestData {
  username: string
  password: string
}

export interface UpdateTableRequestData {
  id: string
  username: string
  password?: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  vno?: string | null
  /** 查询参数：手机号 */
  phone?: string | null

  /** 查询参数：用于排序 */
  order?: string | null
}
export interface GetTableRequestVesselData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  size: number

  username?: string | null
  date?: string | null
  order?: string | null
  /** 查询参数：船只编号 */
  vesselID?: string | null
}

export interface GetTableRequestUserData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  size: number
}
export interface GetLastRegData {
  vno: string
  vRegTime: string
}

export interface GetLastBookingData {
  vesselID: string
  subTime: string
}

export interface GetTableRequestAllData {}
export interface GetNewTableRequestAllData {}

export interface GetTableDetailRequestData {
  /** 到达时间 */
  subTime: string
  /** 船只id */
  vesselID: string
}

export interface GetTableDetailRequestVData {
  /** 船只id */
  vesselID: string
  /** 船只注册时间 */
  vRegTime: string
}

export interface SetPassData {
  /** 船只id */
  vesselID: string
  /** 到达时间 */
  subTime: string
  /** 是否通过 */
  Passed: Boolean
  /** 审批原因 */
  comment?: string | null
}

export interface SetPassVesselData {
  /** 船只id */
  vesselID: string
  /** 是否通过 */
  vstate: Boolean
  /** 船只注册时间 */
  vRegTime: string
  /** 审批原因 */
  vcomment?: string | null
}

export interface DeleteBookingData {
  vno: string
  subtime: string
}

export interface DeleteUserData {
  username: string
}

export interface Wait10minData {
  type: string
  time: number
  state: number
  vno: string[]
  bridge: string
}
export interface StopUpdateData {
  time: number
  bridge: string
}
export interface CancelBookData {
  vno: string[]
}

export interface GetTableVesselData {
  vno: string
  uname: string
  vname: string
  length: number
  vtype: string
  vstate: number
  vcomment: string
  captainName: string
  captainPhone: string
  height: number
  maxPeopleNum: number
  vregTime: string
}

export interface GetFileData {
  realFiles: string
  virtualFiles: string
}

export interface GetTableUserData {
  username: string
  phone: string
  role: string
  regTime: string
}

export interface GetTableData {
  createTime: string
  arrivalTime: string
  leaveTime: string
  id: string
  username: string
  reason: string
  phone: string
  roles: string
  status: number
  // slotID: string
  comment: string
}
export interface GetbridgeData {
  bridge: string
  timeslots: []
  state: number
}
export interface GetTableAllData {
  id: string
  username: string
  createTime: string
  arrivalTime: String
  leaveTime: string
  reason: string
  phone: string
  roles: string
  status: number
  comment: string
  slotID: string
}
export interface GetNewTableAllData {
  date: string
  timeslot: number
  state: number
  vno: string
  bridge: string
  subtime: string
}

export interface EventsModel {
  title: string
  // with: string
  time: { start: string; end: string }
  color: string
  isEditable: boolean
  id: string
  // description: string
  location: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  total: number
}>

export type GetTableResponseVesselData = ApiResponseData<{
  list: GetTableVesselData[]
  total: number
}>

export type GetTableResponseUserData = ApiResponseData<{
  list: GetTableUserData[]
  total: number
}>

export type GetLastBookingResData = ApiResponseData<{
  ais: boolean
  arrtime: string
  boardOrDep: number
  bookerEmail: string
  bookerName: string
  bookerPhone: string
  brief: string
  comment: string
  detail: string
  leavetime: string
  state: number
  subtime: string
  vno: string
}>

export type GetAISInfoData = ApiResponseData<{
  // mmsi: string
  latitude: string
  longitude: string
  vno: string
  // navigationStatus: string
  booked: boolean
}>
export type GetBridgeInfoData = ApiResponseData<GetbridgeData[]>
export interface VesselApiData {
  // mmsi: string
  latitude: string
  longitude: string
  vno: string
  // navigationStatus: string
  // booked: boolean
  state: number
  arrtime: string
}
export interface VesselAISData {
  course: number
  heading: number
  latitude: number
  longitude: number
  mmsi: string
  shipname: string
  speed: number
  // booked: boolean
  state: number
  arrtime: string
}

export interface GetTableDataViewLast {
  ais: boolean
  arrtime: string
  boardOrDep: number
  bookerEmail: string
  bookerName: string
  bookerPhone: string
  brief: string
  comment: string
  detail: string
  leavetime: string
  state: number
  subtime: string
  vno: string
}

export type GetLastRegResData = ApiResponseData<{
  captainName: string
  captainPhone: string
  height: number
  length: number
  maxPeopleNum: number

  uname: string
  vcomment: string
  vname: string
  vno: string
  vregTime: string
  vstate: number
  vtype: string
}>

export type GetTableResponseAllData = ApiResponseData<{
  list: GetTableAllData[]
  total: number
}>

export type GetNewTableResponseAllData = ApiResponseData<GetNewTableAllData[]>

export type GetTableDetailResponseData = ApiResponseData<{
  vno: string
  subtime: string
  arrtime: string
  leavetime: string
  brief: string
  detail: string
  comment: string
  state: number
  bookerName: string
  bookerPhone: string
  bookerEmail: string
  boardOrDep: number
  ais: boolean
  waterArea: string
}>

export type GetTableDetailResponseVData = ApiResponseData<{
  vno: string
  uname: string
  vname: string
  length: number
  vtype: string
  vstate: number
  vcomment: string
  captainName: string
  captainPhone: string
  height: number
  maxPeopleNum: number
  vregTime: string
  realFiles: string[]
  virtualFiles: string[]
  vdel: number
  // realFiles: []
  // virtualFiles: []
}>

export interface GetCollisionListData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  size: number
  // 警报编号
  alarmId?: string | null
  // 用户名
  uname?: string | null
  /** 受影响的船只 */
  vno?: string | null
  // 摄像头编号
  cameraId?: string | null
  // 警报状态
  alarmState?: string | null
  // 排序规则
  order?: string | null
}

export interface GetCollisionListTableData {
  alarmDel: boolean
  alarmDetail: string
  // alarmID是string还是number
  alarmID: number
  alarmPicUrl: string
  alarmState: number
  alarmTime: string
  cameraID: number
  cameraName: string
  fvno: string
  svno: string
}

export type GetCollisionListResponseData = ApiResponseData<{
  list: GetCollisionListTableData[]
  total: number
}>

export type GetTodayBookedData = ApiResponseData<{
  list: GetTDBookedData[]
}>

export interface GetTDBookedData {
  ais: boolean
  arrtime: string
  boardOrDep: number
  bookerEmail: string
  bookerName: string
  bookerPhone: string
  brief: string
  comment: string
  detail: string
  leavetime: string
  state: number
  subtime: string
  vno: string
}
