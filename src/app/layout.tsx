import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "كافيه كريم — قهوة مختصة، حلويات وموهيتو",
  description: "وجهتك لأجود أنواع القهوة المختصة والحلويات الطازجة والموهيتو المنعش. لحظات تستحق التذوق في كافيه كريم.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
    lang="ar" dir="rtl" data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-ink text-foreground"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
