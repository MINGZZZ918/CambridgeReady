export const PLANS = {
  premium: {
    name: '高级会员',
    nameEn: 'Premium',
    price: '499.00',
    displayPrice: '499',
    interval: 'year' as const,
    features: [
      'AI 写作批改（剑桥 4 维评分）',
      'AI 口语评估（语音转写 + 4 维评分）',
      '逐句批注与改进建议',
      '中英双语反馈',
      'AI 改进版范文 / 回答',
      '学习报告（可分享给家长）',
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
