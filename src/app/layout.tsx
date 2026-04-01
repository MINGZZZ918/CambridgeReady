import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CambridgeReady — AI 驱动的剑桥英语备考平台",
    template: "%s — CambridgeReady",
  },
  description:
    "专为 K12 学生打造的剑桥英语备考平台。AI 写作批改、AI 口语评估、免费备考资料下载，覆盖 KET、PET、FCE 三个级别。",
  keywords: [
    "剑桥英语",
    "KET",
    "PET",
    "FCE",
    "备考",
    "AI 写作批改",
    "AI 口语评估",
    "Cambridge English",
    "K12",
    "英语考试",
  ],
  openGraph: {
    title: "CambridgeReady — AI 驱动的剑桥英语备考平台",
    description:
      "AI 写作批改 + AI 口语评估 + 免费备考资料，覆盖 KET、PET、FCE 三个级别。专为 K12 学生打造。",
    url: "https://www.youngcambridgeready.com",
    siteName: "CambridgeReady",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CambridgeReady — AI 驱动的剑桥英语备考平台",
    description:
      "AI 写作批改 + AI 口语评估 + 免费备考资料，覆盖 KET、PET、FCE 三个级别。",
  },
  metadataBase: new URL("https://www.youngcambridgeready.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${dmSans.variable} ${notoSansSC.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
