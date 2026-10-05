import type { Metadata } from "next";
import "./globals.css";
import CursorTracker from "./CursorTracker";

export const metadata: Metadata = {
  title: "SEES | Secure Electronic Examination System",
  description: "Advanced Clinic Management Prototype by BRO CODE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Adding Google Fonts for a sharper, modern look */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen relative bg-[#09090b] text-white">
        <CursorTracker />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
