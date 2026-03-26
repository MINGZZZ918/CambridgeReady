export const PLANS = {
  premium: {
    name: '高级会员',
    nameEn: 'Premium',
    price: '499.00',
    displayPrice: '499',
    interval: 'year' as const,
    features: [
      '全部 2300+ 练习题',
      '21 套完整模拟卷',
      '中英双语详细解析',
      '错题本自动收录',
      '全部听力音频',
      '学习报告',
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
