# frp (Chinese Community Edition)

[![GitHub release](https://img.shields.io/github/tag/y08lin4/frp.svg?label=release)](https://github.com/y08lin4/frp/releases)

[English](README_en.md) | 简体中文（[README.md](README.md)）

A community-maintained fork of [fatedier/frp](https://github.com/fatedier/frp) focused on Chinese-first experience.

## What's different from upstream

- 🇨🇳 **Localized frps dashboard**: 11 built-in languages (Simplified Chinese as detection fallback), one-click switching, persistent language memory
- 📦 **Ready-to-use builds**: CI builds frps/frpc with the localized dashboard; grab them from [Releases](https://github.com/y08lin4/frp/releases)
- 📖 **Chinese docs & release notes**

**The Go core is untouched** — fully compatible with upstream in protocol, configuration and deployment. The i18n implementation is being upstreamed as a PR; once merged, upstream users get the dashboard translations natively.

## Quick start (server)

```toml
# frps.toml
bindAddr = "0.0.0.0"
bindPort = 7000
auth.token = "your-token"

webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "your-password"
```

```bash
./frps -c frps.toml
```

Open `http://server-ip:7500` — the dashboard speaks your language.

### Only want the localized dashboard?

Official frps binaries can load dashboard assets from disk — no binary replacement needed:

```toml
webServer.assetsDir = "/etc/frp/assets"
```

Upload the `dist/` directory from our CI artifacts and restart frps.

## License

Apache License 2.0, same as upstream. Original frp is copyright [fatedier](https://github.com/fatedier) and the frp community.
