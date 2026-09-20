# frp 中文社区版

[![GitHub release](https://img.shields.io/github/tag/y08lin4/frp.svg?label=release)](https://github.com/y08lin4/frp/releases)

简体中文 / [English](README.md) · 基于 [fatedier/frp](https://github.com/fatedier/frp) 的**中文社区维护版**

## 这是什么

原版 frp 是一个专注于内网穿透的高性能反向代理应用，支持 TCP、UDP、HTTP、HTTPS 等多种协议，且支持 P2P 通信。可以将内网服务以安全、便捷的方式通过具有公网 IP 节点的中转暴露到公网。

本仓库在上游基础上增加了面向中文用户的增强，**内核（Go 代码）零改动**，与上游保持同步：

- 🇨🇳 **frps 管理面板汉化**：内置 11 种语言（简体中文为探测兜底默认），一键切换，选择持久记忆
- 📦 **开箱即用的中文构建**：本仓库 CI 自动构建带中文面板的 frps/frpc，到 [Releases](https://github.com/y08lin4/frp/releases) 直接下载
- 📖 **文档中文化**：README 与 Release 说明均提供简体中文

## 面板预览

切换语言后，frps 管理面板（端口 7500）的导航、总览、客户端、代理等全部界面均为中文，包括相对时间（"3 分钟前"）、状态标签、错误提示与 Element Plus 内置文案。

## 快速开始（服务端）

1. 从 [Releases](https://github.com/y08lin4/frp/releases) 下载对应平台压缩包（或直接使用上游二进制 + 本仓库面板文件，见下）
2. 编写 `frps.toml`：

```toml
bindAddr = "0.0.0.0"
bindPort = 7000
auth.token = "改成你的连接密钥"

# 管理面板
webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "改成你的面板密码"

log.to = "./frps.log"
```

3. 启动：`./frps -c frps.toml`，浏览器打开 `http://服务器IP:7500` 即为中文面板

### 只想要中文面板（已装好官方 frps 的机器）

官方 frps 支持从磁盘加载面板文件，无需替换二进制：

```toml
# 追加到 frps.toml
webServer.assetsDir = "/etc/frp/assets"
```

将本仓库 CI 产物中的 `dist` 目录上传到服务器 `/etc/frp/assets`，重启 frps 即可。

## 客户端

```toml
serverAddr = "你的服务器IP"
serverPort = 7000
auth.token = "与服务端一致"

[[proxies]]
name = "ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 6022
```

更多配置示例（stcp 加密隧道、UDP、静态文件分享等）参见[上游中文文档](https://github.com/fatedier/frp/blob/dev/README_zh.md)与[官方手册](https://gofrp.org/zh-CN/)。

## 与上游的关系

- 本仓库**不是硬分叉**：所有上游功能、协议、配置完全兼容，内核代码保持原样
- 汉化实现（vue-i18n 架构 + 11 语言包）已整理为独立提交，正在向上游提交 PR：合并后你无需本仓库也能获得中文面板
- 上游更新后，本仓库定期同步 dev 分支并重新发布

## 许可

与上游一致，基于 [Apache License 2.0](LICENSE) 开源。原项目版权归 [fatedier](https://github.com/fatedier) 及 frp 社区所有，感谢上游维护者的辛勤付出。
