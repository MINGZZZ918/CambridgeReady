# CambridgeReady UTA 走查报告

> 日期: 2026-04-02
> 范围: 全站功能走查 — 认证、导航、练习、AI 评估、支付、Dashboard、进度、学习报告、激活码

---

## 严重级别说明

| 级别 | 含义 |
|------|------|
| CRITICAL | 功能完全不可用或存在严重安全漏洞 |
| HIGH | 核心功能有明显缺陷，影响用户体验或数据准确性 |
| MEDIUM | 功能可用但有边缘问题或维护隐患 |
| LOW | 小问题、优化建议或文档不一致 |

---

## 一、认证系统 (Auth)

### 1. [CRITICAL] 登录页 Open Redirect 漏洞
- **文件:** `src/app/(auth)/login/page.tsx:12,39`
- **问题:** `redirect` query 参数直接用于 `router.push(redirect)`，无任何验证。攻击者可构造 `/login?redirect=https://evil.com`，用户登录后被重定向到恶意网站。
- **修复:** 验证 redirect 是以 `/` 开头的相对路径，不包含协议或外部域名。

### 2. [CRITICAL] Auth Callback Open Redirect 漏洞
- **文件:** `src/app/api/auth/callback/route.ts:7,13`
- **问题:** `next` query 参数直接用于 `NextResponse.redirect`，无验证。
- **修复:** 同上，验证为安全的相对路径。

### 3. [HIGH] Auth Callback 错误未在登录页显示
- **文件:** `src/app/api/auth/callback/route.ts:17` + `src/app/(auth)/login/page.tsx`
- **问题:** Callback 失败时重定向到 `/login?error=auth_callback_error`，但登录页从未读取 `error` 参数。用户看不到任何错误提示。
- **修复:** 登录页检查 `searchParams.get("error")`，显示 "认证失败，请重试" 提示。

### 4. [HIGH] 注册后未处理邮箱确认流程
- **文件:** `src/app/(auth)/register/page.tsx:31-52`
- **问题:** `signUp` 成功后直接跳转 `/dashboard`。如 Supabase 开启了邮箱确认（默认行为），用户未确认邮箱却被跳转到受保护页面，然后被 middleware 弹回登录页，体验混乱。
- **修复:** 检查 `data.session` 是否为 null，若是则显示 "请查收邮箱确认" 提示。

### 5. [MEDIUM] Middleware 环境变量缺失时静默放行
- **文件:** `src/lib/supabase/middleware.ts:20-22`
- **问题:** `NEXT_PUBLIC_SUPABASE_URL` 或 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 未设置时，middleware 直接 pass-through，所有受保护路由变为公开。
- **修复:** 生产环境应返回 500 或至少记录警告日志。

### 6. [MEDIUM] `/pricing` 在 `(main)` 路由组但不在 PROTECTED_PATHS 中
- **文件:** `src/lib/supabase/middleware.ts:4-15`
- **问题:** `/pricing` 页面在 `(main)` 下使用认证 layout，但 middleware 不保护它。未登录用户访问时看到认证态 Navbar。
- **修复:** 移到 `(public)` 路由组，或添加到 PROTECTED_PATHS。

### 7. [MEDIUM] 注册页丢失登录页的 redirect 参数
- **文件:** `src/app/(auth)/register/page.tsx:51`
- **问题:** 用户从 `/login?redirect=/resources` 点击"注册"链接，注册页丢失 redirect 目标，始终跳转 `/dashboard`。
- **修复:** 将 redirect 参数传递到注册页链接中。

### 8. [LOW] 重置密码错误信息未汉化
- **文件:** `src/app/(auth)/reset-password/page.tsx:40`
- **问题:** 显示 Supabase 原始英文错误信息，与登录/注册页的中文翻译风格不一致。

---

## 二、着陆页与导航 (Landing & Navigation)

### 9. [CRITICAL] 资源页使用占位下载 URL
- **文件:** `src/app/(main)/resources/page.tsx:10`
- **问题:** `FILE_BASE_URL = "https://files.example.com"` — 所有 9 个下载链接均指向占位域名，全部 404。
- **修复:** 替换为真实文件托管地址。

### 10. [HIGH] 缺少 favicon.ico
- **文件:** `public/` 目录
- **问题:** 无 `favicon.ico` 文件，浏览器显示默认空白图标。

### 11. [HIGH] 访客导航指向需认证的 `/resources` 页
- **文件:** `src/components/layout/Navbar.tsx:42-43`
- **问题:** GUEST_NAV "备考资料下载" 链接到 `/resources`，该路由受 middleware 保护。未登录用户点击后被弹回登录页，但营销文案宣传"免费备考资料"。
- **修复:** 将 `/resources` 移至 `(public)` 路由组，或修改导航链接。

### 12. [HIGH] Footer 链接指向受保护的 `/levels/*` 页面
- **文件:** `src/components/layout/Footer.tsx:3-22`
- **问题:** Footer 对所有用户（含未登录）显示相同链接。`/levels/ket`、`/levels/pet`、`/levels/fce` 均受保护，未登录用户点击会被弹到登录页。
- **修复:** 根据登录状态条件渲染 Footer 链接，或将 levels 页公开。

### 13. [MEDIUM] `#pricing`/`#features`/`#levels` 锚点在非首页不工作
- **文件:** `src/components/layout/Navbar.tsx:27-28,34-36,48`
- **问题:** GUEST_NAV 使用 `#pricing`、`#features`、`#levels` 等锚点链接，仅在首页存在对应 `id` 元素。在 `/about`、`/faq` 等页面点击无反应。
- **修复:** 改为 `/#pricing`、`/#features`、`/#levels`。

### 14. [MEDIUM] 着陆页"立即订阅"指向认证态 `/pricing`
- **文件:** `src/components/landing/Pricing.tsx:108-113`
- **问题:** 未登录用户点击后看到认证态 layout，体验不一致。
- **修复:** 链接到 `/register` 或将 pricing 移至公开路由。

### 15. [MEDIUM] "已有激活码"链接指向受保护路由
- **文件:** `src/components/landing/Pricing.tsx:149-155`
- **问题:** 链接到 `/activate`（受保护），未登录用户被弹到登录页但无提示。
- **修复:** 链接改为 `/login?redirect=/activate` 并添加 "需要登录" 说明。

### 16. [MEDIUM] 资源页受保护但宣传为"免费"
- **文件:** `src/app/(main)/resources/page.tsx` + middleware
- **问题:** 营销文案和导航均宣传"免费备考资料下载"，但访问需要登录。与 `/vocabulary`（公开）和 `/writing-templates`（公开）不一致。

### 17. [MEDIUM] About 页面缺少 CTA
- **文件:** `src/app/(public)/about/page.tsx`
- **问题:** 页面末尾无任何行动引导，用户阅读完后无处可去。其他营销页（FAQ、写作模板）均有 CTA。

### 18. [MEDIUM] 词汇页使用 `<a>` 而非 `<Link>` 链接到 `/resources`
- **文件:** `src/app/(public)/vocabulary/page.tsx:303`
- **问题:** 使用原生 `<a>` 标签导致全页刷新，且从公开页链接到受保护页。

### 19. [MEDIUM] Logo 使用原生 `<img>` 加载 1.1MB 文件
- **文件:** 10 处引用 `/logo.png`（login/register/forgot-password/reset-password/Footer/Navbar）
- **问题:** 1.1MB 的 logo 通过 `<img>` 加载，无优化。应使用 `next/image` 自动优化。

### 20. [LOW] Fraunces 字体通过外部 `<link>` 加载
- **文件:** `src/app/layout.tsx:63-66`
- **问题:** 未使用 `next/font/google`，导致 render-blocking 请求。Google Fonts 在中国可能被墙。

### 21. [LOW] 联系页邮箱域名不一致
- **文件:** `src/app/(public)/contact/page.tsx:14`
- **问题:** 邮箱使用 `cambridgeready.com`，但 layout 元数据使用 `youngcambridgeready.com`。

### 22. [LOW] OG/Meta URL 可能与实际生产域名不符
- **文件:** `src/app/layout.tsx:41,52`
- **问题:** 硬编码 `https://www.youngcambridgeready.com`，建议使用 `NEXT_PUBLIC_SITE_URL`。

### 23. [LOW] 推荐语看起来是虚构的
- **文件:** `src/components/landing/Testimonials.tsx:3-43`
- **问题:** 4 条推荐均为 5 星、无可验证身份，读起来像是编造的。

---

## 三、练习系统 (Practice)

### 24. [CRITICAL] 听力音频文件不存在
- **文件:** `src/data/questions/pet-listening-part1.json` (lines 9,39,69,99,129)
- **问题:** 所有听力题引用 `/audio/pet-listening-part1-demo.mp3`，但 `public/audio/` 目录不存在。音频播放器会加载失败且无错误提示。
- **修复:** 上传音频文件或添加加载失败的错误状态。

### 25. [HIGH] KET/FCE 无任何听力题数据
- **文件:** `src/data/questions/` 目录
- **问题:** `levels.ts` 定义了 KET 4 个听力 part、FCE 4 个听力 part，但无对应 JSON 文件。所有听力练习显示"题目即将上线"。总计缺少约 12 个听力数据文件。

### 26. [HIGH] 所有听力题共用同一个音频 URL
- **文件:** `pet-listening-part1.json`
- **问题:** 5 道听力题全部引用相同 `audio_url`，显然是占位数据。

### 27. [HIGH] PET Reading Part 1/2 的 question_type 与 levels.ts 配置不匹配
- **文件:** `src/data/questions/pet-reading-part1.json` vs `src/lib/utils/levels.ts:13`
- **问题:** levels.ts 定义为 `matching`，但 JSON 数据使用 `multiple_choice`。渲染器依赖 JSON 字段所以功能正常，但元数据不一致可能误导其他代码。

### 28. [HIGH] ListeningPlayer 无音频加载失败状态
- **文件:** `src/components/practice/ListeningPlayer.tsx:32-71`
- **问题:** `Howl` 构造函数未设置 `onloaderror` 处理。音频加载失败时，播放按钮保持禁用状态（灰色），用户看不到任何错误信息。

### 29. [MEDIUM] 免费用户每个 Part 仅能看 1 道题
- **文件:** `src/app/(main)/practice/[level]/[skill]/[part]/page.tsx:52-62`
- **问题:** PET Reading Part 1 中仅第一题标记 `is_free: true`。免费用户看到 "1/1" 进度，无提示表明这是限制预览。
- **修复:** 增加免费题目数量（3-5 题），或明确展示 "试用版" 标识。

### 30. [MEDIUM] 练习结果中 question_id 格式与数据库不匹配
- **文件:** `src/app/(main)/practice/[level]/[skill]/[part]/PracticeClient.tsx:74`
- **问题:** 发送 `question_id: "pet-r1-001"`（字符串），但 `user_answers` 表期望 UUID。可能导致外键约束违反（错误被 `.catch(() => {})` 吞掉）。

### 31. [MEDIUM] Practice API insert 包含可能不存在的列
- **文件:** `src/app/api/practice/route.ts:44-50`
- **问题:** 同时发送 `answer` 和 `user_answer` 字段，还包含 `level`、`skill`、`part`。与 `UserAnswer` 类型定义不一致，可能导致插入失败。

### 32. [MEDIUM] fill_blank 评分不检查 correct_answer 字段
- **文件:** `src/lib/utils/scoring.ts:16-21`
- **问题:** 仅检查 `accept_answers[]`，忽略 `correct_answer`。如果题目作者将答案放在 `correct_answer` 而非 `accept_answers`，答案永远判错。

### 33. [MEDIUM] KET/FCE Listening 配置复用 PET_LISTENING
- **文件:** `src/lib/utils/levels.ts:73,90`
- **问题:** KET 和 FCE 的听力部分定义直接使用 `PET_LISTENING`，但三个级别的实际考试结构不同。

### 34. [MEDIUM] Howler.js 动态导入无错误处理
- **文件:** `src/components/practice/ListeningPlayer.tsx:35`
- **问题:** `import("howler")` 无 `.catch()` 处理，模块加载失败时无用户反馈。

### 35. [MEDIUM] SpeakingPrompt 未处理 MediaRecorder 不可用
- **文件:** `src/components/practice/SpeakingPrompt.tsx:18-24`
- **问题:** 旧版浏览器不支持 `MediaRecorder`，错误被捕获但显示误导性信息 "无法访问麦克风"。

### 36. [LOW] Question JSON 缺少 created_at 等接口必需字段
- **文件:** `src/data/questions/*.json` vs `src/types/index.ts:26-27`
- **问题:** JSON 文件缺少 `created_at` 字段，通过 `as Question[]` 强制类型断言绕过检查。

### 37. [LOW] SpeakingPrompt 点击"播放录音"每次创建新 Audio 对象
- **文件:** `src/components/practice/SpeakingPrompt.tsx:330-355`
- **问题:** 快速点击会导致多个音频同时播放，Audio 对象不会被清理。

### 38. [LOW] SpeakingPrompt useEffect cleanup 中 audioUrl 闭包陈旧
- **文件:** `src/components/practice/SpeakingPrompt.tsx:57-68`
- **问题:** Cleanup 函数捕获的 `audioUrl` 始终为 null，导致 blob URL 无法正确释放（轻微内存泄漏）。

---

## 四、AI 评估系统 (AI Evaluation)

### 39. [CRITICAL] 豆包 ASR Authorization Header 格式错误
- **文件:** `src/lib/ai/doubao.ts:60`
- **问题:** Authorization 头设为 `Bearer; ${apiKey}`（多了分号）。标准格式为 `Bearer ${apiKey}`。此错误导致所有 ASR 请求认证失败，**口语评估功能完全不可用**。
- **修复:** 删除分号：`Bearer ${apiKey}`。

### 40. [HIGH] 豆包 ASR 未配置时返回假转写文本
- **文件:** `src/lib/ai/doubao.ts:20-23`
- **问题:** 当 `DOUBAO_API_KEY` 或 `DOUBAO_APP_ID` 未配置时，函数返回中文 stub 消息（而非报错）。该假文本被发送给 Anthropic API 进行"评估"，产出完全无意义的评分。
- **修复:** 未配置时应抛出错误，阻止后续评估流程。

### 41. [HIGH] AI 响应 JSON 未做 schema 验证
- **文件:** `src/app/api/ai/writing-correction/route.ts:116-121` + `speaking-evaluation/route.ts:135-140`
- **问题:** 通过正则 `\{[\s\S]*\}` 提取 JSON 后直接 `JSON.parse()`，不验证字段是否存在。如 AI 返回格式异常（缺少 `scores.content` 等），前端访问时崩溃。
- **修复:** 解析后验证必需字段存在且类型正确。

### 42. [HIGH] 口语评估仅发送最后一段录音
- **文件:** `src/components/practice/SpeakingPrompt.tsx:271-301`
- **问题:** Multi-question 模式下，`audioBlobRef.current` 仅存储最后录制的音频。之前所有问题的录音丢失，评估仅基于最后一段。
- **修复:** 合并所有录音或分别发送。

### 43. [MEDIUM] AI 评估结果的 fire-and-forget 存储可能丢失
- **文件:** `src/app/api/ai/writing-correction/route.ts:126-135` + `speaking-evaluation/route.ts:145-155`
- **问题:** `supabase.from("ai_evaluations").insert(...)` 使用 `.then()` 异步处理。在 Vercel serverless 环境中，响应发送后函数可能被回收，导致插入未完成。
- **修复:** 改为 `await` 等待插入完成后再返回响应。

### 44. [MEDIUM] AI Anthropic Client 缺少 API Key 运行时验证
- **文件:** `src/lib/ai/client.ts:9`
- **问题:** 使用 `process.env.ANTHROPIC_AUTH_TOKEN` 无 fallback 或验证，缺失时运行时报晦涩错误。

### 45. [MEDIUM] 口语评估将考官问题文本作为 `part` 字段发送
- **文件:** `src/components/practice/SpeakingPrompt.tsx:280-282`
- **问题:** `part` 字段值为 `"What's your name?\nHow old are you?"`，服务端 `parseInt(part, 10)` 返回 `NaN` 存入数据库。

### 46. [MEDIUM] 写作批改无输入长度上限
- **文件:** `src/app/api/ai/writing-correction/route.ts:70-83`
- **问题:** 验证了最小 10 词，但无最大限制。用户可提交超长文本消耗大量 API Token。
- **修复:** 添加最大字/词数限制（如 FCE 1000 词、PET 500 词）。

### 47. [MEDIUM] AI 评估端点无速率限制
- **文件:** 两个 AI API 路由
- **问题:** Premium 用户可无限调用 AI 评估，导致 Anthropic API 费用失控。
- **修复:** 实施每用户每小时评估次数限制。

### 48. [LOW] `max_tokens: 2000` 对复杂评估可能不足
- **文件:** 两个 AI API 路由
- **问题:** 长篇 FCE 作文的详细评估（双语反馈 + annotations + 改进版）可能超过 2000 tokens，导致 JSON 截断解析失败。

### 49. [LOW] JSON 提取正则为贪婪模式
- **文件:** 两个 AI API 路由
- **问题:** `\{[\s\S]*\}` 贪婪匹配可能在极端情况下捕获错误内容。

---

## 五、支付系统 (Payment)

### 50. [CRITICAL] Notify 回调中 profile 更新先于 order 更新，order 更新无错误检查
- **文件:** `src/app/api/payment/notify/route.ts:77-98`
- **问题:** 先将 profile 设为 premium（77-84 行），再更新 order 为 paid（91-98 行）。若 order 更新失败：(1) 用户已获 premium 但订单仍为 pending；(2) 下次回调会重复激活。且 order update 返回值未被检查。
- **修复:** 先更新 order 为 paid，再更新 profile；或使用事务。

### 51. [HIGH] 签名验证使用非恒定时间字符串比较
- **文件:** `src/lib/payment/xunhupay.ts:34`
- **问题:** `computed === expected` 存在时序攻击风险。
- **修复:** 使用 `crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(expected))`。

### 52. [HIGH] 支付回调未验证金额
- **文件:** `src/app/api/payment/notify/route.ts:44-50`
- **问题:** 未验证 `params.total_fee === order.amount`。理论上可通过金额异常的回调激活会员。
- **修复:** 添加金额校验。

### 53. [MEDIUM] Checkout 创建 pending 订单后 XunHuPay 调用失败不清理
- **文件:** `src/app/api/checkout/route.ts:45-71`
- **问题:** 订单先 insert 为 pending，若 `createPayment()` 抛错，订单永远停留在 pending 状态。
- **修复:** 失败时更新订单为 failed，或延迟到 API 调用成功后再创建订单。

### 54. [MEDIUM] 订单 ID 使用 Math.random() 生成
- **文件:** `src/app/api/checkout/route.ts:37`
- **问题:** 非加密级随机数，存在极小概率碰撞风险。
- **修复:** 使用 `crypto.randomUUID()` 或 `crypto.randomBytes()`。

### 55. [MEDIUM] PaymentSuccessBanner 超时后无条件显示"成功"
- **文件:** `src/components/payment/PaymentSuccessBanner.tsx:47-49`
- **问题:** 20 秒后无论是否确认到会员状态，都显示"支付成功"。若支付实际失败，用户被误导。
- **修复:** 超时后显示 "请稍后查看会员状态" 而非确定性成功消息。

### 56. [MEDIUM] 环境变量名文档与实际不符
- **文件:** CLAUDE.md vs `src/lib/payment/xunhupay.ts`
- **问题:** 文档写 `XUNHUPAY_APPID`/`XUNHUPAY_APPSECRET`，实际代码使用四个分通道变量。

### 57. [LOW] QR 码弹窗无支付完成轮询
- **文件:** `src/components/payment/CheckoutButtons.tsx:76-106`
- **问题:** 显示"支付完成后页面将自动跳转"，但无轮询机制。PC 端扫码支付后 return_url 在手机端跳转，非当前页面。

### 58. [LOW] notify_url 可能使用 localhost
- **文件:** `src/app/api/checkout/route.ts:62`
- **问题:** fallback 为 `http://localhost:3000`，生产环境忘设 `NEXT_PUBLIC_SITE_URL` 时回调永远收不到。

---

## 六、激活码系统 (Activation)

### 59. [HIGH] 激活码先消耗后更新 profile，失败无回滚
- **文件:** `src/app/api/activate/route.ts:56-113`
- **问题:** 先将激活码标记为 `is_used: true`（56-66 行），再更新用户 profile（98-105 行）。若 profile 更新失败，激活码已消耗但会员未激活。用户重试时提示"激活码已被使用"。激活码永久丢失。
- **修复:** 先更新 profile 再标记激活码，或使用事务。

### 60. [MEDIUM] 未验证 `codeRecord.plan` 值
- **文件:** `src/app/api/activate/route.ts:101`
- **问题:** 直接使用 `codeRecord.plan` 设置会员类型，未验证是否为已知类型（'premium'）。

### 61. [MEDIUM] 未验证 `duration_days` 为正数
- **文件:** `src/app/api/activate/route.ts:95`
- **问题:** `duration_days` 若为 0 或 null，会员立即过期或计算异常。

### 62. [LOW] 激活页面 401 响应未跳转登录
- **文件:** `src/app/(main)/activate/page.tsx`
- **问题:** API 返回 401 时显示与无效激活码相同的错误样式，而非跳转登录页。

---

## 七、Dashboard

### 63. [HIGH] 连续学习天数（streak）逻辑：今天未练习则归零
- **文件:** `src/app/(main)/dashboard/page.tsx:55-72`
- **问题:** 从今天开始计算，今天无练习记录则 streak = 0。一个连续 30 天练习的用户在当天尚未练习时看到 streak = 0。
- **修复:** 若今天无记录，从昨天开始计数（日终宽限期）。

### 64. [MEDIUM] user 可能为 null 时未处理
- **文件:** `src/app/(main)/dashboard/page.tsx:13-17`
- **问题:** `user?.id` 为 undefined 时查询行为不确定。应显式重定向到登录页。

### 65. [MEDIUM] Streak 查询仅取 500 条记录
- **文件:** `src/app/(main)/dashboard/page.tsx:48-53`
- **问题:** 高频用户（日均 50+ 题）500 条仅覆盖约 10 天，长 streak 被截断。

### 66. [LOW] 快捷入口硬编码指向 `/levels/pet`
- **文件:** `src/app/(main)/dashboard/page.tsx:293-294,307-308`
- **问题:** "AI 写作批改"和"AI 口语评估"均链接 `/levels/pet`，不适用于 KET/FCE 学生。

### 67. [LOW] 服务器时区可能与用户时区不一致
- **文件:** Dashboard/Progress/Report 中所有日期计算
- **问题:** 服务端 `new Date()` 使用 UTC，中国用户（UTC+8）可能因时差导致日期分组偏差。

---

## 八、学习进度 (Progress)

### 68. [HIGH] Streak 逻辑三处重复实现
- **文件:** `dashboard/page.tsx:55-72`, `progress/page.tsx:76-93`, `lib/report/fetchReportData.ts:68-126`
- **问题:** 相同逻辑在三个文件中各实现一次，修复一处不会同步到其他两处。
- **修复:** 提取到共享工具函数 `lib/stats/computeUserStats.ts`。

### 69. [MEDIUM] 进度条显示正确率而非完成度
- **文件:** `src/app/(main)/progress/page.tsx:258-266`
- **问题:** 标题写"各级别进度"但条形图用 `accuracy%` 作宽度。做 5 题正确率 80% 和做 500 题正确率 80% 显示相同进度条。
- **修复:** 改标题为"正确率"，或使用完成题数/总题数。

### 70. [LOW] Progress 页面无 user null 防护
- **文件:** `src/app/(main)/progress/page.tsx:14-18`
- **问题:** 同 Dashboard（Issue 64）。

---

## 九、学习报告 (Report)

### 71. [HIGH] 公开报告使用 service role key 查询
- **文件:** `src/app/(public)/r/[token]/page.tsx:14-17`
- **问题:** Token 是唯一安全控制。虽然 token 有 128 位熵，但缺少速率限制防暴力枚举。
- **修复:** 添加 IP 级别速率限制。

### 72. [MEDIUM] ShareButton 使用 `.single()` 可能报错
- **文件:** `src/app/api/report/share/route.ts:16-27`
- **问题:** 0 条结果时 `.single()` 返回 PGRST116 错误。应使用 `.maybeSingle()`。

### 73. [MEDIUM] `ai_evaluations` 和 `report_share_tokens` 表未在 CLAUDE.md 文档化
- **问题:** 文档写 "8 tables"，实际已有 10 张表。

### 74. [MEDIUM] Report Premium 徽章未检查会员到期
- **文件:** `src/components/report/ReportContent.tsx:84`
- **问题:** 仅检查 `profile?.membership === "premium"`，已过期用户仍显示 Premium 徽章。
- **修复:** 使用 `getEffectiveMembership(profile)` 检查。

### 75. [LOW] ShareButton Clipboard API 不支持 HTTP 环境
- **文件:** `src/components/report/ShareButton.tsx:17`
- **问题:** 非 HTTPS 环境下 `navigator.clipboard.writeText()` 失败，错误提示误导（显示"生成失败"而非"复制失败"）。

---

## 十、跨模块问题 (Cross-cutting)

### 76. [HIGH] 会员过期检查不一致
- **文件:** `src/lib/utils/membership.ts` + 多处引用
- **问题:** `getEffectiveMembership()` 正确检查 expiry，但部分代码直接检查 `profile.membership === 'premium'` 而不调用此函数。
- **修复:** 所有会员检查统一使用 `getEffectiveMembership()`。

### 77. [MEDIUM] 所有 API 端点无速率限制
- **问题:** checkout、activate、AI 评估、report/share 等端点均无速率限制。
- **修复:** 至少对 checkout、activate、AI 端点实施速率限制。

### 78. [MEDIUM] 服务器时区影响所有 streak 计算
- **问题:** 三处 streak 逻辑均使用服务端 `new Date()` (UTC)，中国用户可能因 8 小时时差导致日期分组异常。

### 79. [LOW] `getEffectiveMembership` 在无 expiry 时返回原始 membership
- **文件:** `src/lib/utils/membership.ts:8`
- **问题:** `membership_expires_at` 为 null 时，premium 用户被视为永久会员。若非有意设计则为漏洞。

### 80. [LOW] `getDaysUntilExpiry` 可返回负数
- **文件:** `src/lib/utils/membership.ts:18-26`
- **问题:** 过期后返回负数（如 -5），语义不清。

### 81. [LOW] Supabase Client 环境变量使用 `!` 非空断言无 fallback
- **文件:** `src/lib/supabase/client.ts:5-6`
- **问题:** 环境变量缺失时崩溃报错信息不清晰。

---

## 统计汇总

| 严重级别 | 数量 |
|----------|------|
| CRITICAL | 5 |
| HIGH | 16 |
| MEDIUM | 35 |
| LOW | 25 |
| **总计** | **81** |

### CRITICAL 问题清单（必须立即修复）
1. **#1** 登录页 Open Redirect 漏洞
2. **#2** Auth Callback Open Redirect 漏洞
3. **#9** 资源页使用占位下载 URL `files.example.com`
4. **#24** 听力音频文件不存在
5. **#39** 豆包 ASR Bearer 头格式错误（口语评估完全不可用）

### HIGH 问题清单（应尽快修复）
6. **#3** Auth callback 错误未显示
7. **#4** 注册忽略邮箱确认流程
8. **#10** 缺少 favicon
9. **#11** 访客导航指向受保护的 /resources
10. **#12** Footer 链接指向受保护页面
11. **#25** KET/FCE 无听力数据
12. **#26** 听力题共用同一音频 URL
13. **#27** question_type 与 levels.ts 不匹配
14. **#28** ListeningPlayer 无错误状态
15. **#40** ASR 未配置时返回假文本
16. **#41** AI 响应 JSON 未做验证
17. **#42** 口语评估仅发送最后录音
18. **#50** Notify 回调 race condition
19. **#51** 签名验证时序攻击风险
20. **#52** 支付回调未验证金额
21. **#59** 激活码先消耗后更新 profile 无回滚
22. **#63** Streak 今天未练习归零
23. **#68** Streak 逻辑三处重复
24. **#71** 公开报告无速率限制
25. **#76** 会员过期检查不一致
