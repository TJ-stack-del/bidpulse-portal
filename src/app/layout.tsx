import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BidPulse | Institutional Janitorial Procurement",
  description: "Procurement intelligence and 100-point rubric scoring engine for facilities contracts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 flex flex-col`}>
        <Navbar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
