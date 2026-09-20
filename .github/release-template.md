## 🇨🇳 frp 中文社区版

基于上游 [fatedier/frp](https://github.com/fatedier/frp) 构建，**Go 内核零改动**，本版本新增：

- 🇨🇳 **frps 管理面板汉化**：内置 11 种语言（English / 简体中文 / 繁體中文 / 日本語 / 한국어 / Español / Deutsch / Français / Русский / Português (BR) / Tiếng Việt）
- 🌐 **智能语言检测**：自动跟随浏览器语言；检测不到匹配时默认简体中文；手动切换后持久记忆（localStorage）
- 📦 面板为构建时内置，无需额外配置 `assetsDir`

## 📥 下载

按你的平台选择对应压缩包（`sha256sums` 文件提供校验和）：

| 平台 | 文件 |
|---|---|
| Linux x64 | `frp_*_linux_amd64.tar.gz` |
| Linux ARM64 | `frp_*_linux_arm64.tar.gz` |
| Windows x64 | `frp_*_windows_amd64.zip` |
| macOS Apple Silicon | `frp_*_darwin_arm64.tar.gz` |
| macOS Intel | `frp_*_darwin_amd64.tar.gz` |

压缩包内含 `frps`（服务端）与 `frpc`（客户端）二进制。

## 🚀 快速上手

```toml
# frps.toml
bindAddr = "0.0.0.0"
bindPort = 7000
auth.token = "改成你的连接密钥"

# 中文管理面板
webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "改成你的面板密码"
```

```bash
./frps -c frps.toml
```

浏览器打开 `http://服务器IP:7500` 即为中文面板。

## ⚠️ 说明

- 协议、配置与上游完全兼容，可无缝替换现有部署
- 版本号规则：`上游版本-zh.序号`（如 `v0.71.0-zh.1` 基于上游 v0.71.0）
- 上游更新后本仓库会跟进重新发布；i18n 实现也在向上游提交 PR
- 原项目版权归 [fatedier](https://github.com/fatedier) 及 frp 社区所有，基于 Apache License 2.0 开源
