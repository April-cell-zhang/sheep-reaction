# 安全与隐私 / Security and privacy

视频仅在本机浏览器内作为 ImageBitmap 传给本地 Worker，MediaPipe 输出手部关键点，再由游戏计算状态。无麦克风请求，无 MediaRecorder、上传接口、账号、遥测、远程排行榜或浏览器持久化存储。校准与成绩保存在页面内存，刷新后清除。关闭摄像头或离开页面会停止轨道并终止识别线程。

模型、WASM 和脚本从本站相对路径加载。公开访问时托管商会接收 IP、访问时间及资源请求等常规信息；不要将“本地识别”理解为访问网页完全没有网络连接。浏览器扩展和操作系统行为不属于本项目可控制范围。

识别受光线、遮挡、手型与设备影响。结果、趣味称号和计时只用于娱乐，没有医学验证，不用于疾病预防、诊断或治疗，不能准确测量生理反应能力。没有收集真实用户健康数据。

Video frames and landmarks are processed in browser memory by the local worker. There is no application upload, recording, telemetry or persistent storage. Hosting providers still receive normal HTTP requests. Closing the camera stops tracks and terminates the worker. This entertainment game is not medically validated and cannot accurately measure physiological reaction time.

发现问题时，请勿在公开 issue 上传私人摄像头画面、凭据或个人信息。可提交去标识化复现步骤；公开发布时如启用 GitHub 私密漏洞报告，可通过仓库 Security 页面报告敏感问题。
