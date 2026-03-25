import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tangkiem.xyz";

export const metadata: Metadata = {
  title: {
    default: "Tàng Kiếm - Đọc truyện tiểu thuyết online",
    template: "%s | Tàng Kiếm",
  },
  description:
    "Tàng Kiếm - Đọc truyện tiên hiệp, kiếm hiệp, huyền huyễn online miễn phí. Cập nhật liên tục, kho truyện đồ sộ.",
  keywords:
    "đọc truyện, truyện tiên hiệp, kiếm hiệp, huyền huyễn, truyện online, tàng kiếm",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Tàng Kiếm",
    title: "Tàng Kiếm - Đọc truyện tiểu thuyết online",
    description:
      "Đọc truyện tiên hiệp, kiếm hiệp, huyền huyễn online miễn phí. Cập nhật liên tục.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tàng Kiếm - Đọc truyện tiểu thuyết online",
    description:
      "Đọc truyện tiên hiệp, kiếm hiệp, huyền huyễn online miễn phí.",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Thêm Google Search Console verification code ở đây
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

