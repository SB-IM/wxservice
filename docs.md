weixin service
=====
weixin service Doc

## 基本要求

### 可以使用的技术栈：
- 语言：`golang >= 1.12`, `javascipts`, `typescript`
- 数据库: `sqlite3`, `postgresql`
- javascript 相关：
  - 编译器：`webpack`, `babel`, `tsc`
  - 包管理: `npm`, `yarn` 注：禁止使用 `cnpm`
  - nodejs web框架 `koa.js`
  - 单元测试 `jest`, `mocha`
  - 界面：`react`, `vue`
  - 如要使用其他的请提前说明

### 程序启动时要读配置文件
允许使用配置文件格式为: `yaml`, `json`, `toml`, `传入环境变量 仅限golang`

配置应有配置项：
- 微信相关配置项
- 数据库配置项
- 和主系统连接的 `client_id` 和 `client_secret`
- webhook 允许的地址白名单 []
- webhook secret []

## 代码风格
https://github.com/SB-IM/developer-center/wiki/Common-Code-Style

使用 `.editorconfig` 来设置代码编辑器。请确保编辑器可以识别 `.editorconfig`

```sh
cat > .editorconfig << EOF
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

EOF
```


## 版本控制只能使用 git
代码提交风格:
https://github.com/linuxdeepin/developer-center/wiki/Git-Commit-Message-Style


### 测试代码覆盖率应在 60% 以上
这个不做硬性规定，但要保证核心代码和接口都要有测试(接口都要有测试！ 接口都要有测试！接口都要有测试！)

所有的 API 都要做 mock

并不推荐写完代码再补测试的开发流程

### !!!请使用 TDD 的开发模式

测试用例请自行编写


## 注
`微信帐号 -> 主帐号 -> 用户组` 这个是一对一的关系

`用户组 -> 主帐号` 只有这个是一对多的关系


## API

### 进入微信
1. 拿微信 `openid`
2. 之后在 setting 页面。（这个自己实现）绑定主帐号和用户组


### 主帐号登录
通过 Oauth2.0 的 password 模式来获取用户信息
1. 拿到用户输入的帐号密码后发起 https 请求。使用Oauth2.0 的 password 模式
2. 拿到 `access_token` 之后调用 https://staging.sblab.xyz/apidoc/#api-User-user
来拿到用户信息，主要是 `id` 和 `group_id`
3. 更新数据库绑定主帐号 或 将数据结构写入数据库

以下是 `curl` 版实现流程。可当作参考。注：禁止调用 `shell curl` 去实现这个功能
```sh
$ curl http://localhost:3000/oauth/token \
-F grant_type="password" \
-F username="test@sb.im" \
-F password="test" \
-F client_id="<client_id>" \
-F client_secret="<client_secret>"

# Success
{"access_token":"<token>","token_type":"bearer","expires_in":7200,"created_at":1527151263}

# Failure
{"error":"invalid_grant","error_description":"The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client."}
```

```sh
$ curl http://localhost:3000/api/v1/user/ -H "Authorization: Bearer <token>"
```

```json
{
  "id": 12345,
  "email": "sb@sb.im",
  "group": {
    "id": 123,
    "name": "",
    "description": ""
  }
}
```

### 接收 webhook 接口
`prefix: /<xxx>/api/v1/`
1. 这个请求为 POST form-data 格式的数据（这个请求可能有 `几十M` ）。并 `header` 有 `hmac` 签名，签名字段：`X-SB-Signature` （签名只对 body 进行签名)

如果对 hmac 签名头不了解，请参考：https://developer.github.com/webhooks/

2. 验证 hmac 签名
3. 生成报告页面(查看报告页面要验证权限)
4. 拿请求中的 group_id， 来对微信用户推送消息

```
id: 123 <unique ID. 每个 report 都是唯一的>
user_id: 1 <这个可能没有（不存在），因为有定时自动执行的情况>
group_id: 1 <根据这个来决定向哪些用户推送>
plan_id: 1
plan_name: ""
plan_description: ""

// 结果文件，可能有多个。如果是图片就显示出来。文件就提供下载按钮。（会有特殊格式的图片，比如 tif 格式的图片，也要显示出来）
// results 里的键值可能是不固定的，也可能没有。。。没有是中途某个流程出错了。
results[]

// 目前要显示有两个文件
// 1. map 文件（csv 格式。前端解析在地图上绘制）。要可以切换地图 google 和 amap
// 2. orthomosaic 文件（tif 格式。行业标准直接覆盖到地图上）。要可以切换地图 google 和 amap

```


## Web UI

### 设置页面
设置主帐号登录。绑定和解绑

注：帐号解绑不允许删除数据

### 报告展示页面
要有鉴权，分辨率适配所有尺寸的手机。包括 `iphone se`

## Schema
每个表都要有 `id`, `created_at` 和 `updated_at`
`created_at` 和 `updated_at` 使用 `datatime` 类型来存储。如果是 `postgresql` 使用 `timestamp`


