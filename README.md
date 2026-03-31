# CambridgeReady

剑桥英语（KET / PET / FCE）在线备考平台，面向 K12 学生，提供练习题库、模拟考试、错题本、学习进度追踪等功能。

## 技术栈

- **框架**: Next.js 15 (App Router) + TypeScript
- **样式**: Tailwind CSS
- **数据库 & 认证**: Supabase (PostgreSQL + Auth)
- **支付**: 虎皮椒 XunHuPay (微信支付 / 支付宝)
- **部署**: Vercel

## 功能特性

- **分级练习** — KET、PET、FCE 三个级别，覆盖阅读、听力、写作、口语四项技能
- **多种题型** — 选择题、填空题、匹配题、开放写作、口语录音
- **口语模块** — 基于 MediaRecorder API 的录音练习，支持倒计时准备、计时录音、回放和自评
- **模拟考试** — 完整模拟卷，按 Part 组卷，成绩分析
- **错题本** — 自动收录错题，支持筛选和排序
- **学习进度** — 正确率统计、连续学习天数、技能雷达图
- **会员系统** — 免费 / 高级会员两档，支持在线支付和激活码
- **到期提醒** — Dashboard 状态卡片、全局到期横幅、Navbar 会员徽章

## 本地开发

### 环境变量

复制 `.env.example`（或手动创建 `.env.local`），填入以下变量：

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
XUNHUPAY_APPID=
XUNHUPAY_APPSECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 启动

```bash
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

### 常用命令

```bash
npm run build    # 生产构建
npm run lint     # ESLint 检查
```

## 项目结构

```
src/
├── app/
│   ├── (auth)/          # 登录、注册页
│   ├── (main)/          # 主功能页（需登录）
│   │   ├── dashboard/   # 首页仪表盘
│   │   ├── levels/      # 级别选择 & 技能分区
│   │   ├── practice/    # 练习页（核心路径）
│   │   ├── exam/        # 模拟考试
│   │   ├── mistakes/    # 错题本
│   │   ├── progress/    # 学习进度
│   │   ├── pricing/     # 会员定价
│   │   └── activate/    # 激活码兑换
│   └── api/             # API 路由（支付回调、考试等）
├── components/          # 可复用组件
│   ├── practice/        # 练习组件（选择题、匹配题、录音等）
│   ├── membership/      # 会员相关（到期横幅）
│   ├── payment/         # 支付按钮
│   ├── progress/        # 图表组件
│   └── layout/          # Navbar、Footer
├── data/questions/      # 题库 JSON 文件
├── lib/                 # 工具函数、Supabase 客户端、支付逻辑
└── types/               # TypeScript 类型定义
```

## 数据库

使用 Supabase PostgreSQL，主要表：

| 表 | 用途 |
|---|------|
| `profiles` | 用户信息 & 会员状态 |
| `questions` | 题库（JSONB content） |
| `user_answers` | 答题记录 |
| `learning_progress` | 聚合学习统计 |
| `mock_exams` | 模拟卷定义 |
| `exam_results` | 考试成绩 |
| `payment_orders` | 支付订单 |
| `activation_codes` | 激活码 |

数据库迁移脚本位于 `supabase/` 目录。

## 会员方案

| | 免费 | 高级会员 (¥499/年) |
|---|------|-------------------|
| 每级别 1 套样卷 | ✓ | ✓ |
| 全部题库 (2300+) | | ✓ |
| 完整模拟卷 | | ✓ |
| 中英双语解析 | | ✓ |
| 错题本 & 学习报告 | | ✓ |

## License

Private project. All rights reserved.
