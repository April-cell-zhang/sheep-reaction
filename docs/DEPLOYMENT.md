# GitHub Pages 部署方案（待用户确认后执行）

1. 仅以此独立目录创建 sheep-reaction 公开仓库；默认分支 main。
2. GitHub Settings → Pages → Deploy from a branch → main → /(root)。不编写自定义 Actions 工作流（GitHub 仍使用其内置部署流程），不需要令牌或仓库秘密。
3. 使用 GitHub 默认 HTTPS 地址 https://<账户名>.github.io/sheep-reaction/ ，强制 HTTPS，不绑定自定义域名。账户名待创建前读取登录状态，不能臆造。
4. .nojekyll 已准备；运行时相对路径兼容项目子目录。依赖和模型全部随仓库提供，不使用 CDN。
5. 部署后检查 app.js、Worker、WASM、模型均为 200；WASM 为 application/wasm；确认摄像头授权、开启/关闭、三关选择和演示按钮。公网首次部署验收必须单独完成，本地通过不代表公网已通过。

公开内容：根目录 HTML/JS/MJS、vendor/、licenses/、MIT LICENSE、第三方声明、中英 README、SECURITY.md、docs/ 中部署说明与截图/动画。
排除：本机工作区、sources/、备份、个人启动器、开发验证页面、自动化依赖、审计脚本及原始日志。无构建命令、后端、数据库、API key 或环境变量。

Local preview: python -m http.server 8768, then http://localhost:8768 . Public hosting needs HTTPS for camera access.

官方依据：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
HTTPS：https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
