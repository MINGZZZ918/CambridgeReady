"use client";

import { useState } from "react";

const LEVEL_TABS = [
  { key: "ket", label: "KET", color: "#10B981", lightBg: "#ECFDF5" },
  { key: "pet", label: "PET", color: "#F59E0B", lightBg: "#FFFBEB" },
  { key: "fce", label: "FCE", color: "#8B5CF6", lightBg: "#F5F3FF" },
] as const;

type LevelKey = (typeof LEVEL_TABS)[number]["key"];

interface VocabItem {
  word: string;
  pos: string;
  meaning: string;
  example: string;
}

interface VocabCategory {
  category: string;
  words: VocabItem[];
}

const VOCAB_DATA: Record<LevelKey, VocabCategory[]> = {
  ket: [
    {
      category: "日常生活",
      words: [
        { word: "appointment", pos: "n.", meaning: "预约，约会", example: "I have a doctor's appointment at 3pm." },
        { word: "available", pos: "adj.", meaning: "可用的，有空的", example: "Is this seat available?" },
        { word: "comfortable", pos: "adj.", meaning: "舒适的", example: "This chair is very comfortable." },
        { word: "convenient", pos: "adj.", meaning: "方便的", example: "The shop is in a convenient location." },
        { word: "customer", pos: "n.", meaning: "顾客", example: "The customer asked for a refund." },
        { word: "deliver", pos: "v.", meaning: "递送，交付", example: "They deliver pizza to your door." },
        { word: "experience", pos: "n.", meaning: "经验，经历", example: "It was an amazing experience." },
        { word: "furniture", pos: "n.", meaning: "家具", example: "We bought new furniture for the living room." },
        { word: "immediately", pos: "adv.", meaning: "立刻", example: "Please come here immediately." },
        { word: "ordinary", pos: "adj.", meaning: "普通的", example: "It was just an ordinary day." },
      ],
    },
    {
      category: "学校教育",
      words: [
        { word: "absent", pos: "adj.", meaning: "缺席的", example: "Tom was absent from school yesterday." },
        { word: "calculator", pos: "n.", meaning: "计算器", example: "You can use a calculator in the exam." },
        { word: "certificate", pos: "n.", meaning: "证书", example: "She received a certificate for her achievement." },
        { word: "concentrate", pos: "v.", meaning: "集中注意力", example: "I need to concentrate on my homework." },
        { word: "course", pos: "n.", meaning: "课程", example: "I'm taking an English course." },
        { word: "education", pos: "n.", meaning: "教育", example: "Education is very important." },
        { word: "knowledge", pos: "n.", meaning: "知识", example: "He has a good knowledge of history." },
        { word: "primary", pos: "adj.", meaning: "小学的，主要的", example: "She goes to a primary school." },
        { word: "result", pos: "n.", meaning: "结果，成绩", example: "The exam results will be out next week." },
        { word: "subject", pos: "n.", meaning: "科目", example: "Maths is my favourite subject." },
      ],
    },
    {
      category: "旅行交通",
      words: [
        { word: "accommodation", pos: "n.", meaning: "住宿", example: "We need to book accommodation for the trip." },
        { word: "arrival", pos: "n.", meaning: "到达", example: "The arrival time is 6pm." },
        { word: "boarding pass", pos: "n.", meaning: "登机牌", example: "Please show your boarding pass." },
        { word: "cancel", pos: "v.", meaning: "取消", example: "We had to cancel the trip." },
        { word: "departure", pos: "n.", meaning: "出发，离开", example: "The departure gate is B12." },
        { word: "destination", pos: "n.", meaning: "目的地", example: "London is our final destination." },
        { word: "direction", pos: "n.", meaning: "方向", example: "Can you give me directions to the station?" },
        { word: "luggage", pos: "n.", meaning: "行李", example: "Don't forget your luggage." },
        { word: "passenger", pos: "n.", meaning: "乘客", example: "All passengers must wear seatbelts." },
        { word: "return", pos: "n./v.", meaning: "返回，往返", example: "I'd like a return ticket to London." },
      ],
    },
    {
      category: "健康运动",
      words: [
        { word: "ache", pos: "n./v.", meaning: "疼痛", example: "I have a headache." },
        { word: "bandage", pos: "n.", meaning: "绷带", example: "The nurse put a bandage on his arm." },
        { word: "diet", pos: "n.", meaning: "饮食", example: "A healthy diet is important." },
        { word: "exercise", pos: "n./v.", meaning: "运动，锻炼", example: "Regular exercise keeps you healthy." },
        { word: "injury", pos: "n.", meaning: "受伤", example: "He had a knee injury." },
        { word: "medicine", pos: "n.", meaning: "药物", example: "Take this medicine twice a day." },
        { word: "patient", pos: "n.", meaning: "病人", example: "The doctor sees many patients every day." },
        { word: "prescription", pos: "n.", meaning: "处方", example: "The doctor wrote a prescription." },
        { word: "symptom", pos: "n.", meaning: "症状", example: "What are your symptoms?" },
        { word: "temperature", pos: "n.", meaning: "体温，温度", example: "She has a high temperature." },
      ],
    },
  ],
  pet: [
    {
      category: "工作职业",
      words: [
        { word: "achievement", pos: "n.", meaning: "成就", example: "Winning the award was a great achievement." },
        { word: "application", pos: "n.", meaning: "申请", example: "I submitted my job application online." },
        { word: "career", pos: "n.", meaning: "职业生涯", example: "She had a successful career in medicine." },
        { word: "colleague", pos: "n.", meaning: "同事", example: "My colleagues are very friendly." },
        { word: "competition", pos: "n.", meaning: "竞赛，竞争", example: "There's a lot of competition for jobs." },
        { word: "deadline", pos: "n.", meaning: "截止日期", example: "The deadline is next Friday." },
        { word: "employer", pos: "n.", meaning: "雇主", example: "My employer offers good benefits." },
        { word: "interview", pos: "n.", meaning: "面试", example: "I have a job interview tomorrow." },
        { word: "profession", pos: "n.", meaning: "职业", example: "Teaching is a rewarding profession." },
        { word: "qualification", pos: "n.", meaning: "资格，资质", example: "You need the right qualifications for this job." },
      ],
    },
    {
      category: "环境自然",
      words: [
        { word: "atmosphere", pos: "n.", meaning: "大气层；氛围", example: "The Earth's atmosphere protects us from the sun." },
        { word: "climate", pos: "n.", meaning: "气候", example: "The climate is getting warmer." },
        { word: "conservation", pos: "n.", meaning: "保护", example: "Wildlife conservation is important." },
        { word: "disaster", pos: "n.", meaning: "灾难", example: "The earthquake was a terrible disaster." },
        { word: "endangered", pos: "adj.", meaning: "濒危的", example: "Pandas are an endangered species." },
        { word: "environment", pos: "n.", meaning: "环境", example: "We must protect the environment." },
        { word: "pollution", pos: "n.", meaning: "污染", example: "Air pollution is a serious problem." },
        { word: "recycle", pos: "v.", meaning: "回收利用", example: "We should recycle paper and plastic." },
        { word: "renewable", pos: "adj.", meaning: "可再生的", example: "Solar energy is a renewable resource." },
        { word: "wildlife", pos: "n.", meaning: "野生动物", example: "The park is home to lots of wildlife." },
      ],
    },
    {
      category: "科技媒体",
      words: [
        { word: "access", pos: "n./v.", meaning: "访问，使用权", example: "Students have access to the library." },
        { word: "broadcast", pos: "v./n.", meaning: "广播，播放", example: "The match was broadcast live on TV." },
        { word: "connect", pos: "v.", meaning: "连接", example: "Connect your phone to the Wi-Fi." },
        { word: "device", pos: "n.", meaning: "设备", example: "Smartphones are useful devices." },
        { word: "download", pos: "v.", meaning: "下载", example: "You can download the app for free." },
        { word: "headline", pos: "n.", meaning: "标题，头条", example: "The story made the headlines." },
        { word: "influence", pos: "n./v.", meaning: "影响", example: "Social media has a big influence on young people." },
        { word: "online", pos: "adj./adv.", meaning: "在线的", example: "I prefer shopping online." },
        { word: "software", pos: "n.", meaning: "软件", example: "We need to update the software." },
        { word: "upload", pos: "v.", meaning: "上传", example: "Upload your photos to the cloud." },
      ],
    },
    {
      category: "情感关系",
      words: [
        { word: "admire", pos: "v.", meaning: "钦佩", example: "I really admire her courage." },
        { word: "apologise", pos: "v.", meaning: "道歉", example: "He apologised for being late." },
        { word: "behave", pos: "v.", meaning: "表现，举止", example: "Please behave well in class." },
        { word: "confident", pos: "adj.", meaning: "自信的", example: "She feels confident about the exam." },
        { word: "disappointed", pos: "adj.", meaning: "失望的", example: "I was disappointed with my results." },
        { word: "embarrassed", pos: "adj.", meaning: "尴尬的", example: "She felt embarrassed in front of everyone." },
        { word: "generous", pos: "adj.", meaning: "慷慨的", example: "It was very generous of you to help." },
        { word: "grateful", pos: "adj.", meaning: "感激的", example: "I'm grateful for your support." },
        { word: "relationship", pos: "n.", meaning: "关系", example: "They have a good relationship." },
        { word: "sympathy", pos: "n.", meaning: "同情", example: "I have great sympathy for the victims." },
      ],
    },
  ],
  fce: [
    {
      category: "学术表达",
      words: [
        { word: "acknowledge", pos: "v.", meaning: "承认，认可", example: "She acknowledged her mistake." },
        { word: "acquire", pos: "v.", meaning: "获得，习得", example: "It takes time to acquire new skills." },
        { word: "analyze", pos: "v.", meaning: "分析", example: "We need to analyze the data carefully." },
        { word: "comprehensive", pos: "adj.", meaning: "全面的", example: "The report provides a comprehensive overview." },
        { word: "consequence", pos: "n.", meaning: "后果", example: "You must accept the consequences of your actions." },
        { word: "demonstrate", pos: "v.", meaning: "展示，证明", example: "The experiment demonstrates how gravity works." },
        { word: "evaluate", pos: "v.", meaning: "评估", example: "We need to evaluate the effectiveness of the plan." },
        { word: "investigate", pos: "v.", meaning: "调查", example: "Police are investigating the case." },
        { word: "significant", pos: "adj.", meaning: "重要的，显著的", example: "There has been a significant improvement." },
        { word: "substantial", pos: "adj.", meaning: "大量的，实质性的", example: "A substantial amount of money was raised." },
      ],
    },
    {
      category: "社会文化",
      words: [
        { word: "ancestor", pos: "n.", meaning: "祖先", example: "Our ancestors lived very different lives." },
        { word: "controversy", pos: "n.", meaning: "争议", example: "The decision caused a lot of controversy." },
        { word: "diversity", pos: "n.", meaning: "多样性", example: "Cultural diversity makes society richer." },
        { word: "discrimination", pos: "n.", meaning: "歧视", example: "Discrimination based on age is unfair." },
        { word: "heritage", pos: "n.", meaning: "遗产，传统", example: "The city has a rich cultural heritage." },
        { word: "inequality", pos: "n.", meaning: "不平等", example: "There is growing inequality in society." },
        { word: "multicultural", pos: "adj.", meaning: "多元文化的", example: "London is a multicultural city." },
        { word: "prejudice", pos: "n.", meaning: "偏见", example: "We should fight against prejudice." },
        { word: "tradition", pos: "n.", meaning: "传统", example: "It's a tradition to eat cake on birthdays." },
        { word: "welfare", pos: "n.", meaning: "福利", example: "The government provides welfare support." },
      ],
    },
    {
      category: "高级形容词",
      words: [
        { word: "absurd", pos: "adj.", meaning: "荒谬的", example: "The idea is completely absurd." },
        { word: "ambiguous", pos: "adj.", meaning: "含糊的，模棱两可的", example: "The instructions were rather ambiguous." },
        { word: "compelling", pos: "adj.", meaning: "引人注目的，令人信服的", example: "She made a compelling argument." },
        { word: "enthusiastic", pos: "adj.", meaning: "热情的", example: "The audience was very enthusiastic." },
        { word: "genuine", pos: "adj.", meaning: "真正的，真诚的", example: "He showed genuine concern for others." },
        { word: "inevitable", pos: "adj.", meaning: "不可避免的", example: "Change is inevitable." },
        { word: "magnificent", pos: "adj.", meaning: "壮丽的，极好的", example: "The view was absolutely magnificent." },
        { word: "overwhelming", pos: "adj.", meaning: "压倒性的", example: "The response was overwhelming." },
        { word: "remarkable", pos: "adj.", meaning: "非凡的", example: "She made remarkable progress." },
        { word: "subtle", pos: "adj.", meaning: "微妙的", example: "There are subtle differences between them." },
      ],
    },
    {
      category: "高级动词与短语",
      words: [
        { word: "come across", pos: "phr.v.", meaning: "偶然发现", example: "I came across an interesting article." },
        { word: "give up", pos: "phr.v.", meaning: "放弃", example: "Never give up on your dreams." },
        { word: "look into", pos: "phr.v.", meaning: "调查，研究", example: "We'll look into the matter." },
        { word: "make up for", pos: "phr.v.", meaning: "弥补", example: "I'll make up for lost time." },
        { word: "put up with", pos: "phr.v.", meaning: "忍受", example: "I can't put up with the noise." },
        { word: "run out of", pos: "phr.v.", meaning: "用完", example: "We've run out of milk." },
        { word: "take into account", pos: "phr.", meaning: "考虑到", example: "We must take all factors into account." },
        { word: "turn down", pos: "phr.v.", meaning: "拒绝", example: "She turned down the job offer." },
        { word: "bring about", pos: "phr.v.", meaning: "引起，导致", example: "Technology has brought about many changes." },
        { word: "carry out", pos: "phr.v.", meaning: "执行，实施", example: "We need to carry out the plan." },
      ],
    },
  ],
};

export default function VocabularyPage() {
  const [activeLevel, setActiveLevel] = useState<LevelKey>("ket");
  const currentTab = LEVEL_TABS.find((t) => t.key === activeLevel)!;
  const categories = VOCAB_DATA[activeLevel];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Header */}
      <section className="py-16 lg:py-20 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-blue">
          Vocabulary
        </p>
        <h1
          className="mt-4 text-3xl font-semibold tracking-tight text-text-primary lg:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          核心词汇
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-text-secondary">
          KET / PET / FCE 各级别高频考试词汇，按主题分类
        </p>
      </section>

      {/* Level tabs */}
      <div className="flex justify-center gap-3">
        {LEVEL_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveLevel(tab.key)}
            className="rounded-[--radius-pill] px-5 py-2 text-sm font-bold transition-all"
            style={
              activeLevel === tab.key
                ? { backgroundColor: tab.color, color: "#fff" }
                : { backgroundColor: tab.lightBg, color: tab.color }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vocabulary content */}
      <section className="mt-10 pb-24 lg:pb-32 space-y-10">
        {categories.map((cat) => (
          <div key={cat.category}>
            <h2
              className="text-lg font-semibold tracking-tight text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {cat.category}
            </h2>
            <div className="mt-4 overflow-hidden rounded-[--radius-md] border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-card">
                    <th className="px-5 py-3 text-left font-medium text-text-primary">单词</th>
                    <th className="hidden px-5 py-3 text-left font-medium text-text-primary sm:table-cell">词性</th>
                    <th className="px-5 py-3 text-left font-medium text-text-primary">中文释义</th>
                    <th className="hidden px-5 py-3 text-left font-medium text-text-primary lg:table-cell">例句</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.words.map((item, idx) => (
                    <tr
                      key={item.word}
                      className={idx % 2 === 0 ? "bg-bg-card/50" : "bg-bg-card"}
                    >
                      <td className="px-5 py-3">
                        <span className="font-medium" style={{ color: currentTab.color }}>
                          {item.word}
                        </span>
                        <span className="ml-1.5 text-xs text-text-tertiary sm:hidden">{item.pos}</span>
                      </td>
                      <td className="hidden px-5 py-3 text-text-tertiary sm:table-cell">{item.pos}</td>
                      <td className="px-5 py-3 text-text-secondary">{item.meaning}</td>
                      <td className="hidden px-5 py-3 text-text-secondary lg:table-cell">
                        <span className="italic text-text-tertiary">{item.example}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="rounded-[--radius-md] border border-border bg-bg-card p-6 text-center">
          <p className="text-sm text-text-secondary">
            以上为各级别部分核心词汇，完整词汇表请前往
            <a href="/resources" className="ml-1 text-blue hover:underline">资料下载</a>
            页面下载 PDF 版本
          </p>
        </div>
      </section>
    </div>
  );
}
