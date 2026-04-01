"use client";

import { useState } from "react";
import Link from "next/link";

const LEVEL_TABS = [
  { key: "ket", label: "KET", color: "#10B981", lightBg: "#ECFDF5" },
  { key: "pet", label: "PET", color: "#F59E0B", lightBg: "#FFFBEB" },
  { key: "fce", label: "FCE", color: "#8B5CF6", lightBg: "#F5F3FF" },
] as const;

type LevelKey = (typeof LEVEL_TABS)[number]["key"];

interface Template {
  part: string;
  type: string;
  description: string;
  tips: string[];
  structure: string[];
  sample: {
    prompt: string;
    essay: string;
  };
}

const TEMPLATE_DATA: Record<LevelKey, Template[]> = {
  ket: [
    {
      part: "Part 6",
      type: "短信/便条",
      description: "根据给定情景写一条 25-35 词的短信或便条，包含 3 个内容要点。",
      tips: [
        "注意字数要求：25-35 词，不要写太长",
        "必须覆盖所有 3 个内容要点",
        "语气要自然，像真实短信",
        "开头和结尾可以简短",
      ],
      structure: [
        "称呼（Hi / Dear + 名字）",
        "要点 1（回应或引入话题）",
        "要点 2（提供信息或建议）",
        "要点 3（提出请求或确认）",
        "简短结尾",
      ],
      sample: {
        prompt: "You want to go swimming with your English friend Sam on Saturday. Write a message to Sam. Say: where you want to go swimming, what time to meet, what Sam should bring.",
        essay: "Hi Sam,\n\nDo you want to go swimming at the new sports centre on Saturday? Let's meet at 2pm at the entrance. Please bring your swimming cap and a towel.\n\nSee you there!\nLi Ming",
      },
    },
    {
      part: "Part 7",
      type: "短篇故事/描述",
      description: "根据给定的图片或开头句写一段 35 词以上的短文。",
      tips: [
        "字数至少 35 词",
        "用简单句和连接词组织内容",
        "使用过去时态讲述故事",
        "描述事件要有逻辑顺序",
      ],
      structure: [
        "引入（使用给定的开头句）",
        "发展（描述发生了什么）",
        "结尾（结果或感受）",
      ],
      sample: {
        prompt: "Look at the three pictures. Write the story shown in the pictures. Write 35 words or more. (A boy finds a cat in the park, takes it home, the cat becomes his pet.)",
        essay: "Last Saturday, Tom was walking in the park when he found a small cat under a tree. The cat looked very hungry and cold. Tom picked it up carefully and took it home. His mother helped him give the cat some warm milk and food. The cat was very happy and stayed with Tom. Now they are best friends.",
      },
    },
  ],
  pet: [
    {
      part: "Part 1",
      type: "电子邮件",
      description: "写一封约 100 词的电子邮件，回复朋友的来信，涵盖所有要求的内容要点。",
      tips: [
        "字数约 100 词（可以在 90-110 之间）",
        "语气要友好自然，适合写给朋友",
        "必须回应邮件中提到的所有要点",
        "使用适当的开头和结尾语",
      ],
      structure: [
        "开头问候（Hi/Dear + 名字 + 感谢来信/回应第一个要点）",
        "主体段落 1（回应 2-3 个要点）",
        "主体段落 2（继续回应 + 提出问题或建议）",
        "结尾（期待回复 + 署名）",
      ],
      sample: {
        prompt: "Your English friend Alex has written to you about a school project on healthy eating. Reply to Alex's email. In your email: suggest a topic for the project, explain why you think this topic is interesting, offer to help Alex with the project.",
        essay: "Hi Alex,\n\nThanks for your email! Your school project on healthy eating sounds really interesting.\n\nI think you should write about how different countries have different healthy foods. For example, in China we eat a lot of vegetables and rice, while in other countries people eat more bread and cheese. I think this topic is interesting because we can learn about food cultures around the world.\n\nI'd love to help you with the project! I can find some information about Chinese healthy food and send it to you. We could also make a poster together if you like.\n\nLet me know what you think!\nBest wishes,\nLi Ming",
      },
    },
    {
      part: "Part 2",
      type: "文章/故事",
      description: "二选一：写一篇约 100 词的文章 (article) 或故事 (story)。",
      tips: [
        "文章：需要标题，有引入和总结",
        "故事：需要情节发展，有开头、经过、结尾",
        "使用丰富的形容词和连接词",
        "注意段落分配要合理",
      ],
      structure: [
        "文章结构：标题 → 引入段（引起兴趣）→ 主体段（2个要点/原因）→ 总结段",
        "故事结构：开头（设定场景）→ 发展（事件经过）→ 高潮（转折点）→ 结局（感受）",
      ],
      sample: {
        prompt: "Your teacher has asked you to write an article about: The best place to visit in your town. Write your article in about 100 words.",
        essay: "The Best Place to Visit in My Town\n\nIf you come to my town, you must visit the old park near the river. It is the most beautiful place here.\n\nIn spring, the park is full of colourful flowers, and you can walk along the river and enjoy the fresh air. There is also a small café where you can sit and have a cup of tea while watching the boats on the river.\n\nAt weekends, local artists often come to paint pictures in the park, which makes it even more special. It is a perfect place to relax and forget about your worries.\n\nI really recommend visiting this wonderful park!",
      },
    },
  ],
  fce: [
    {
      part: "Part 1",
      type: "议论文 (Essay)",
      description: "针对给定话题和两个观点写一篇 140-190 词的议论文，需要加入自己的观点。",
      tips: [
        "字数严格控制在 140-190 词",
        "必须讨论题目给出的两个观点，并加入自己的第三个观点",
        "使用正式语域，不要太口语化",
        "要有清晰的段落结构和连接词",
        "结尾要给出自己明确的立场",
      ],
      structure: [
        "引言段：引入话题 + 简述将讨论的内容",
        "主体段 1：讨论第一个给定观点（支持/反对 + 原因）",
        "主体段 2：讨论第二个给定观点（支持/反对 + 原因）",
        "主体段 3：你自己的观点 + 理由",
        "结论段：总结 + 明确立场",
      ],
      sample: {
        prompt: "In your English class you have been talking about the importance of exercise. Now your teacher has asked you to write an essay. Write an essay using all the notes and give reasons for your point of view. Notes: Some people say exercise is important because: 1. it keeps you healthy 2. it helps you make friends. Write about these two ideas and add your own idea.",
        essay: "In today's world, many people lead sedentary lifestyles, which makes the topic of exercise more relevant than ever. There are several reasons why regular physical activity is essential.\n\nFirstly, exercise plays a crucial role in maintaining good health. Regular physical activity strengthens the heart, improves circulation and helps prevent diseases such as diabetes and obesity. Even moderate exercise, like walking for thirty minutes a day, can make a significant difference to one's overall wellbeing.\n\nSecondly, participating in sports and group activities is an excellent way to socialise and build friendships. When people exercise together, they share experiences and develop bonds that often extend beyond the gym or playing field.\n\nIn addition to these points, I believe exercise is vital for mental health. Physical activity releases endorphins, which reduce stress and anxiety, and it has been shown to improve concentration and academic performance.\n\nIn conclusion, exercise benefits us physically, socially and mentally. I strongly believe that everyone should make time for regular physical activity in their daily routine.",
      },
    },
    {
      part: "Part 2",
      type: "文章/信件/评论/报告",
      description: "四选一题型（article / email or letter / review / report），140-190 词。",
      tips: [
        "文章 (Article)：需要标题，语气可以稍微不那么正式，要吸引读者",
        "信件 (Letter/Email)：注意开头结尾格式，语气取决于写信对象",
        "评论 (Review)：推荐/不推荐需明确，包含正反面描述",
        "报告 (Report)：需要标题和小标题，语气正式，提出建议",
      ],
      structure: [
        "文章：标题 → 引人入胜的开头 → 2-3 个要点段落 → 总结/号召",
        "评论：介绍 → 优点 → 缺点 → 推荐/总结",
        "报告：引言（目的）→ 分标题段落 → 建议/结论",
        "信件：称呼 → 目的 → 主体要点 → 结尾 → 署名",
      ],
      sample: {
        prompt: "You recently visited a new restaurant and want to write a review for your school magazine. Write your review in 140-190 words.",
        essay: "The Green Kitchen — A Restaurant Worth Visiting\n\nLast weekend, I had the pleasure of dining at The Green Kitchen, a new vegetarian restaurant that recently opened on Market Street, and I was thoroughly impressed.\n\nThe restaurant has a modern, welcoming atmosphere with comfortable seating and tasteful decoration. The menu offers a wide variety of creative dishes, from hearty mushroom burgers to delicate Thai coconut soup. I particularly enjoyed the homemade pasta with roasted vegetables, which was absolutely delicious.\n\nThe service was friendly and efficient, although we did have to wait about twenty minutes for our main course, which was slightly disappointing on a quiet evening.\n\nHowever, what truly sets The Green Kitchen apart is its commitment to using locally sourced, organic ingredients. The prices are reasonable too, with main courses ranging from £8 to £14.\n\nOverall, I would highly recommend The Green Kitchen to anyone looking for healthy, flavourful food in a pleasant environment. It proves that vegetarian cuisine can be both satisfying and exciting.",
      },
    },
  ],
};

export default function WritingTemplatesPage() {
  const [activeLevel, setActiveLevel] = useState<LevelKey>("ket");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const currentTab = LEVEL_TABS.find((t) => t.key === activeLevel)!;
  const templates = TEMPLATE_DATA[activeLevel];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Header */}
      <section className="py-16 lg:py-20 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-blue">
          Writing Templates
        </p>
        <h1
          className="mt-4 text-3xl font-semibold tracking-tight text-text-primary lg:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          写作模板
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-text-secondary">
          KET / PET / FCE 各题型写作模板、高分技巧和范文参考
        </p>
      </section>

      {/* Level tabs */}
      <div className="flex justify-center gap-3">
        {LEVEL_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveLevel(tab.key);
              setExpandedIdx(0);
            }}
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

      {/* Templates content */}
      <section className="mt-10 pb-24 lg:pb-32 space-y-6">
        {templates.map((tpl, idx) => (
          <div
            key={`${activeLevel}-${tpl.part}`}
            className="overflow-hidden rounded-[--radius-md] border border-border bg-bg-card"
          >
            {/* Template header */}
            <button
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex rounded-[--radius-pill] px-3 py-1 text-xs font-bold"
                  style={{ backgroundColor: currentTab.lightBg, color: currentTab.color }}
                >
                  {tpl.part}
                </span>
                <div>
                  <h3 className="text-[15px] font-medium text-text-primary">{tpl.type}</h3>
                  <p className="mt-0.5 text-sm text-text-secondary">{tpl.description}</p>
                </div>
              </div>
              <svg
                className={`h-5 w-5 shrink-0 text-text-tertiary transition-transform ${expandedIdx === idx ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded content */}
            {expandedIdx === idx && (
              <div className="border-t border-border px-6 pb-6 pt-5 space-y-6">
                {/* Tips */}
                <div>
                  <h4 className="text-sm font-medium text-text-primary">写作技巧</h4>
                  <ul className="mt-3 space-y-2">
                    {tpl.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: currentTab.color }} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Structure */}
                <div>
                  <h4 className="text-sm font-medium text-text-primary">文章结构</h4>
                  <div className="mt-3 space-y-2">
                    {tpl.structure.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: currentTab.color }}
                        >
                          {i + 1}
                        </span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample */}
                <div>
                  <h4 className="text-sm font-medium text-text-primary">范文参考</h4>
                  <div className="mt-3 rounded-lg border border-border bg-[#FAFAF7] p-5">
                    <p className="text-sm font-medium text-text-primary">题目：</p>
                    <p className="mt-1 text-sm italic text-text-secondary">
                      {tpl.sample.prompt}
                    </p>
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-sm font-medium text-text-primary">范文：</p>
                      <div className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                        {tpl.sample.essay}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between rounded-lg border border-border bg-[#FAFAF7] p-4">
                  <p className="text-sm text-text-secondary">
                    想要 AI 帮你批改写作？试试在线写作练习
                  </p>
                  <Link
                    href={`/levels/${activeLevel}`}
                    className="rounded-[--radius-pill] px-4 py-2 text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: currentTab.color }}
                  >
                    去练习
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
