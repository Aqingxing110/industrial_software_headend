import { request } from "@/utils/service"
import type * as Table from "./types/table"

/** 增 */
export function createTableDataApi(data: Table.CreateTableRequestData) {
  return request({
    url: "table",
    method: "post",
    data
  })
}

/** 审批 */
export function setPassApi(data: Table.SetPassData) {
  return request({
    url: "admin/application/passed",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: string) {
  return request({
    url: `table/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "table",
    method: "put",
    data
  })
}

/** 查 */
export function getTableDataApi(params: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "admin/application/list",
    method: "get",
    params
  })
}

/** 查-detail */
export function getTableDetailDataApi(params: Table.GetTableDetailRequestData) {
  return request<Table.GetTableDetailResponseData>({
    url: "admin/application/detail",
    method: "get",
    params
  })
}

/** 查-all */
export function getTableDataAllApi(params: Table.GetTableRequestAllData) {
  return request<Table.GetTableResponseAllData>({
    url: "admin/application/all",
    method: "get",
    params
  })
}

// New-查-all
export function getNewTableDataAllApi(params: Table.GetNewTableRequestAllData) {
  return request<Table.GetNewTableResponseAllData>({
    url: "admin/timeslot/all",
    method: "get",
    params
  })
}

//以下是船只注册相关接口API
export function getTableDataVesselApi(params: Table.GetTableRequestVesselData) {
  return request<Table.GetTableResponseVesselData>({
    url: "admin/vessel/list",
    method: "get",
    params
  })
}

/** 查-detail */
export function getTableDetailDataVApi(params: Table.GetTableDetailRequestVData) {
  return request<Table.GetTableDetailResponseVData>({
    url: "admin/vessel/detail",
    method: "get",
    params
  })
}

/** 审批 */
export function setPassVesselApi(data: Table.SetPassVesselData) {
  return request({
    url: "admin/vessel/examine",
    method: "post",
    data
  })
}

//船只注册相关接口API结束

//以下是用户注册相关接口API
export function getTableDataUserApi(params: Table.GetTableRequestUserData) {
  return request<Table.GetTableResponseUserData>({
    url: "admin/register/list",
    method: "get",
    params
  })
}

//用户注册相关接口API结束

//#region 删除船只预约申请开始
export function deleteBookingApi(data: Table.DeleteBookingData) {
  return request({
    url: "admin/application/delete",
    method: "post",
    data
  })
}
//#endregion 删除船只预约申请结束

// #region 船只  注册  申请信息关联（链接更改前的申请）开始
export function getLastRegApi(params: Table.GetLastRegData) {
  return request<Table.GetLastRegResData>({
    url: "admin/vessel/viewlast",
    method: "get",
    params
  })
}
// #endregion 船只  注册  申请信息关联（链接更改前的申请）结束

// #region 删除用户 开始
export function deleteUserApi(data: Table.DeleteUserData) {
  return request({
    url: "admin/register/delete",
    method: "post",
    data
  })
}
// #endregion 删除用户 结束

// #region 船只注册删除 开始
export function deleteVesselResApi(vno: string) {
  return request({
    url: `admin/vessel/delete/${vno}`,
    method: "post"
  })
}
// #endregion 船只注册删除 结束

// #region 船只Booking停泊申请信息关联，链接更改前的申请 开始
export function getLastBookingApi(params: Table.GetLastBookingData) {
  return request<Table.GetLastBookingResData>({
    url: "admin/application/viewlast",
    method: "get",
    params
  })
}

// #endregion 船只Booking停泊申请信息关联，链接更改前的申请 结束

// #region 获取船只AIS信息 开始
export function getAISInfoApi(vno: string) {
  return request<Table.GetAISInfoData>({
    url: `admin/AIS/getCurrentPosition/${vno}`,
    method: "get"
  })
}
// #endregion 获取船只AIS信息 结束

// #region 碰撞检测警报查看 开始 /api/ai/alarm/collision/list
export function getCollisionListApi(data: Table.GetCollisionListData) {
  return request<Table.GetCollisionListResponseData>({
    url: "admin/alarm/collision/list",
    method: "post",
    data
  })
}
// #endregion 碰撞检测警报查看 结束

// #region 24. 碰撞检测警报解决 开始
export function setSolveApi(alarmID: number) {
  return request({
    url: `admin/alarm/collision/solve/${alarmID}`,
    method: "post"
  })
}
// #endregion 24. 碰撞检测警报解决 结束

// #region 当天的预约时间表 <Table.GetTodayBookedData>
export function getTodayBookedApi() {
  return request<Table.GetTodayBookedData>({
    url: "admin/application/today",
    method: "get"
  })
}
// #endregion 当天的预约时间表

// #region 查询桥梁状态以及预约情况 admin/bridge/passed/{date}
export function getBridgeInfoApi(date: string) {
  return request<Table.GetBridgeInfoData>({
    url: `admin/bridge/passed/${date}`,
    method: "get"
  })
}
// #endregion 查询桥梁状态以及预约情况

// #region 获取sensor阈值
export function getSensorthApi() {
  return request({
    url: "admin/bridge/sensor",
    method: "get"
  })
}
// #endregion 获取sensor阈值

// #region 25. 发送船只等待10分钟信息
export function Wait10minApi(data: Table.Wait10minData) {
  return request({
    url: "admin/bridge/wait",
    method: "post",
    data
  })
}
// #endregion 25. 发送船只等待10分钟信息

// #region 向船只发送可通行提示 admin/bridge/notice/{bridge}
export function SendPassInfoApi(bridge: string) {
  return request({
    url: `admin/bridge/notice/${bridge}`,
    method: "get"
  })
}
// #endregion 向船只发送可通行提示

// #region 弹窗关闭停止更新confirm按钮
export function StopUpdateApi(data: Table.StopUpdateData) {
  return request({
    url: "admin/bridge/reminder/confirm",
    method: "post",
    data
  })
}
// #endregion 弹窗关闭停止更新confirm按钮

// #region 取消船只预约并通知
export function CancelBookApi(data: Table.CancelBookData) {
  return request({
    url: "admin/bridge/notice/cancel",
    method: "post",
    data
  })
}
// #endregion 取消船只预约并通知
