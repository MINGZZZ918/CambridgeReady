import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策 — CambridgeReady",
  description: "CambridgeReady 隐私政策，说明我们如何收集、使用和保护您的个人信息。",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8">
      <section className="py-24 lg:py-32">
        <p className="text-sm font-medium uppercase tracking-widest text-blue text-center">
          法律条款
        </p>
        <h1
          className="mt-4 text-center text-4xl font-semibold tracking-tight text-text-primary lg:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          隐私政策
        </h1>
        <p className="mt-6 text-center text-text-secondary">
          最后更新：2025 年 1 月 1 日
        </p>

        <div className="mt-16 space-y-10 text-[15px] leading-relaxed text-text-secondary">
          <section>
            <h2 className="text-lg font-semibold text-text-primary">1. 信息收集</h2>
            <p className="mt-3">
              我们在你注册和使用本平台时会收集以下信息：
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>注册信息：电子邮件地址、密码（加密存储）</li>
              <li>学习数据：练习记录、考试成绩、错题记录、学习进度</li>
              <li>支付信息：订单号、支付方式、支付状态（我们不直接存储银行卡或支付宝/微信支付账户信息，支付由第三方支付服务处理）</li>
              <li>设备信息：浏览器类型、操作系统、IP 地址（用于安全防护）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">2. 信息使用</h2>
            <p className="mt-3">
              我们收集的信息用于以下目的：
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>提供和改进学习服务</li>
              <li>生成个性化的学习报告和建议</li>
              <li>处理支付和会员管理</li>
              <li>客户支持与沟通</li>
              <li>平台安全与防止滥用</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">3. 数据存储与安全</h2>
            <p className="mt-3">
              用户数据存储在 Supabase 提供的安全云数据库中，所有数据表均启用行级安全策略 (Row-Level Security)，确保用户只能访问自己的数据。数据传输全程使用 HTTPS 加密。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">4. 信息共享</h2>
            <p className="mt-3">
              我们不会向第三方出售或出租你的个人信息。以下情况除外：
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>经你明确同意</li>
              <li>法律法规要求</li>
              <li>为提供服务所必需的第三方服务商（如支付处理商），且这些服务商受相应保密义务约束</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">5. 未成年人保护</h2>
            <p className="mt-3">
              本平台主要面向 K12 学生。我们特别注意保护未成年人的个人信息。未满 14 周岁的用户应在监护人的同意和指导下注册和使用本平台。监护人有权查看、修改或删除其子女的个人信息。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">6. 你的权利</h2>
            <p className="mt-3">你有权：</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>查看和更新你的个人信息</li>
              <li>要求删除你的账户和相关数据</li>
              <li>撤回对数据处理的同意</li>
              <li>导出你的学习数据</li>
            </ul>
            <p className="mt-3">
              如需行使以上权利，请联系 support@cambridgeready.com。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">7. Cookie 使用</h2>
            <p className="mt-3">
              本平台使用必要的 Cookie 来维持你的登录状态和会话信息。我们不使用第三方跟踪 Cookie 或广告 Cookie。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">8. 政策更新</h2>
            <p className="mt-3">
              我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并更新"最后更新"日期。重大变更时，我们会通过邮件或平台内通知的方式告知你。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">9. 联系方式</h2>
            <p className="mt-3">
              如对本隐私政策有任何疑问或建议，请联系：support@cambridgeready.com
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
