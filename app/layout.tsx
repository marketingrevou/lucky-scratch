import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waktunya Self-Reward! 🎁",
  description: "Gosok kartu & temukan kejutan gajianmu — by RevoU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
