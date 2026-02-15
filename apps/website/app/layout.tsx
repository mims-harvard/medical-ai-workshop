import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Algorithmic Foundations for Medical AI in the Real World — ICML 2026 Workshop",
  description:
    "A workshop on the algorithmic frontier of post-deployment improvement for medical AI. Featuring the Virtual Clinic world model, invited talks, and a global health panel. ICML 2026.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "Medical AI Workshop — ICML 2026",
    url: "https://medical-ai-workshop.github.io" /* TODO: Replace with actual URL */,
    type: "website",
    locale: "en_US",
    title:
      "Algorithmic Foundations for Medical AI in the Real World — ICML 2026",
    description:
      "A workshop on post-deployment improvement for medical AI. Featuring the Virtual Clinic, invited speakers, and a global health panel.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Algorithmic Foundations for Medical AI in the Real World — ICML 2026",
    description:
      "A workshop on post-deployment improvement for medical AI. ICML 2026.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.add("light");document.querySelector('meta[name="theme-color"]').setAttribute("content","#ffffff")}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
