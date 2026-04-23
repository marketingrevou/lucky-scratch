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
    <html lang="id" className="h-full overflow-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;900&display=swap"
          media="print"
          // @ts-expect-error onLoad is valid for non-blocking font swap
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;900&display=swap"
          />
        </noscript>
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
