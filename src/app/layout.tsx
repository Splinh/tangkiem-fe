import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Tàng Kiếm - Đọc truyện tiểu thuyết online",
    template: "%s | Tàng Kiếm",
  },
  description:
    "Tàng Kiếm - Đọc truyện tiên hiệp, kiếm hiệp, huyền huyễn online miễn phí. Cập nhật liên tục, kho truyện đồ sộ.",
  keywords:
    "đọc truyện, truyện tiên hiệp, kiếm hiệp, huyền huyễn, truyện online, tàng kiếm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
