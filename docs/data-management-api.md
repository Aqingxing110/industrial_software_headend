# 数据管理接口文档（按当前前端设计）

## 1. 文档范围

本文档对应当前数据管理页面实现：

- 页面不再提供数据库选择。
- 页面按项目分区展示：公开项目、私有项目。
- 用户先选择项目，再查看/上传/下载/预览/删除该项目下文件。

## 2. 基础信息

- Base URL: `http://localhost:8081`
- 鉴权: `Authorization` 请求头（由前端统一注入）
- 页面固定业务类型: `dbType=simulationResult`

说明：

- `dbType` 为接口必填，但在当前页面中不暴露给用户，前端固定传 `simulationResult`。

## 3. 页面流程与接口映射

### 3.1 公开/私有分区切换

- 公开项目页签：调用“公开项目分页接口”
- 私有项目页签：调用“私有项目分页接口”
- 选择项目后：调用“项目文件列表接口”

### 3.2 文件操作

- 上传文件：必须传 `projectId`
- 下载文件：必须传 `projectId`
- 下载预览图：必须传 `projectId`
- 删除文件：必须传 `projectId`

## 4. 项目相关接口

### 4.1 分页获取公开项目

- 方法: `POST`
- 路径: `/modProjects/shared/page`
- 用途: 获取当前用户所属组织的公开项目（用于“公开项目”页签）

请求体：

```json
{
  "pageNum": 1,
  "pageSize": 200,
  "keyword": ""
}
```

响应体（示例）：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "projectId": 10,
        "project_name": "shared-org-1",
        "creation_time": "2026-04-10T10:00:00",
        "creator": "owner",
        "organization": "org-1"
      }
    ],
    "total": 1,
    "size": 200,
    "current": 1
  }
}
```

### 4.2 分页获取私有项目

- 方法: `POST`
- 路径: `/modProjects/private/page`
- 用途: 获取当前用户私有项目（用于“私有项目”页签）

请求体：

```json
{
  "pageNum": 1,
  "pageSize": 200,
  "keyword": ""
}
```

响应体结构同 4.1。

## 5. 文件相关接口

## 5.1 项目文件列表

- 方法: `GET`
- 路径: `/dataManagement/files`
- 用途: 分页查询某个项目下的文件

查询参数：

- `dbType`（固定 `simulationResult`）
- `projectId`（必填）
- `pageNum`（必填）
- `pageSize`（必填）
- `keyword`（可选）

请求示例：

```text
GET /dataManagement/files?dbType=simulationResult&projectId=10&pageNum=1&pageSize=10&keyword=
```

响应体（示例）：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 10,
    "total": 1,
    "pages": 1,
    "records": [
      {
        "id": "e6a1c3f8f3a848c5b1f20e8f2b6a3c0a",
        "fileName": "report.pdf",
        "fileSize": "2.5 MB",
        "description": null,
        "projectId": 10,
        "updateTime": "2026-04-10 18:00:00",
        "hasPreview": true,
        "previewImageId": "b31d7f2b3f2a4d16a6c5c8e0f1a9d22c"
      }
    ]
  }
}
```

## 5.2 上传文件

- 方法: `POST`
- 路径: `/dataManagement/upload`
- 用途: 上传文件到当前选中项目

表单参数：

- `dbType`（固定 `simulationResult`）
- `fileName`（必填）
- `projectId`（必填）
- `file`（必填）
- `previewImage`（可选）

请求示例：

```text
POST /dataManagement/upload (multipart/form-data)
```

## 5.3 下载文件

- 方法: `GET`
- 路径: `/dataManagement/download`
- 用途: 下载指定项目下文件

查询参数：

- `dbType`（固定 `simulationResult`）
- `field`（文件ID）
- `projectId`（必填）

## 5.4 下载预览图

- 方法: `GET`
- 路径: `/dataManagement/preview`
- 用途: 获取指定项目下文件预览图

查询参数：

- `dbType`（固定 `simulationResult`）
- `fileId`（文件ID）
- `projectId`（必填）

## 5.5 删除文件

- 方法: `DELETE`
- 路径: `/dataManagement/delete`
- 用途: 删除指定项目下文件

查询参数：

- `dbType`（固定 `simulationResult`）
- `fileId`（文件ID）
- `projectId`（必填）

## 6. 前端实现约束（当前版本）

1. 仅使用以下项目接口：
   - `/modProjects/shared/page`
   - `/modProjects/private/page`

2. 不使用混合项目接口：
   - `/modProjects/accessible/page`

3. 文件接口调用必须携带当前选中项目 `projectId`。

4. 页面端会对文件列表做兜底校验：
   - 如果返回记录中存在不属于当前 `projectId` 的数据，前端将过滤并告警。
   - 该行为用于保护展示一致性，并辅助排查后端过滤问题。

## 7. 错误处理建议

- `401`：未登录或登录过期
- `403`：无权限访问项目或文件
- `404`：接口地址错误
- `-1/业务错误码`：按 `message` 透出提示（例如项目不存在、文件不存在、跨项目访问）

## 8. 联调检查清单

1. 切换“公开项目/私有项目”后，项目列表是否对应分区。
2. 文件列表是否严格属于当前选中项目。
3. 上传后文件是否只出现在对应项目。
4. 下载/预览/删除是否只能操作当前项目内文件。
5. 后端若返回跨项目记录，前端控制台是否出现告警信息。
