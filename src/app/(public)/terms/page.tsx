import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "用户协议 — CambridgeReady",
  description: "CambridgeReady 用户服务条款。",
};

export default function TermsPage() {
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
          用户协议
        </h1>
        <p className="mt-6 text-center text-text-secondary">
          最后更新：2026 年 4 月 1 日
        </p>

        <div className="mt-16 space-y-10 text-[15px] leading-relaxed text-text-secondary">
          <section>
            <h2 className="text-lg font-semibold text-text-primary">1. 服务说明</h2>
            <p className="mt-3">
              CambridgeReady（以下简称"本平台"）是一个 AI 驱动的剑桥英语备考平台，提供 KET、PET、FCE 三个级别的在线练习、免费备考资料下载、AI 写作批改和 AI 口语评估服务。本平台与 Cambridge Assessment English 无官方关联。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">2. 账户注册</h2>
            <p className="mt-3">
              用户需提供有效的电子邮件地址注册账户。你有责任保管好自己的账户凭证，并对通过你的账户进行的所有活动负责。如果你未满 18 周岁，应在监护人的同意和指导下使用本平台。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">3. 会员服务</h2>
            <p className="mt-3">
              本平台提供免费和付费（高级会员）两种服务等级。免费用户可下载备考资料并进行写作和口语的在线练习；高级会员可享受 AI 写作批改（剑桥标准四维评分）和 AI 口语评估（语音转写 + 四维评分）等功能。会员费用以购买时页面显示的价格为准，目前为 ¥499/年。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">4. 付款与退款</h2>
            <p className="mt-3">
              会员费用通过微信支付或支付宝支付，一经支付即开通服务。由于数字内容的特殊性，开通后一般不支持退款。如遇特殊情况，请联系客服协商处理。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">5. 用户行为规范</h2>
            <p className="mt-3">
              用户不得将本平台内容用于商业用途，不得通过技术手段批量获取平台数据，不得分享或转让自己的会员账户。违反以上规定的，本平台有权终止其账户。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">6. 知识产权</h2>
            <p className="mt-3">
              本平台上的所有原创内容（包括但不限于题目、解析、界面设计）受著作权法保护。用户仅限于个人学习目的使用这些内容。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">7. AI 功能使用条款</h2>
            <p className="mt-3">
              本平台的 AI 写作批改和口语评估功能由第三方人工智能服务提供技术支持。AI 生成的评分和反馈仅供参考，不代表官方考试评分标准。用户在使用 AI 功能时提交的内容将被发送至第三方 AI 服务进行处理，处理完成后不会被长期存储。用户应避免在提交的内容中包含敏感个人信息。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">8. 免责声明</h2>
            <p className="mt-3">
              本平台尽力确保内容的准确性，但不对学习效果或考试结果做任何保证。所有练习题目为模拟题，非官方真题。本平台不承担因使用本服务产生的任何间接损失。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">9. 协议变更</h2>
            <p className="mt-3">
              本平台保留随时修改本协议的权利。修改后的条款将在平台上公布，继续使用本平台即视为接受修改后的条款。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">10. 联系方式</h2>
            <p className="mt-3">
              如对本协议有任何疑问，请联系：support@cambridgeready.com
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
