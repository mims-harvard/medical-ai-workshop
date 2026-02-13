import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Clinic API",
  description:
    "REST API for multi-turn conversations with simulated patient agents powered by Synthea EHR data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
