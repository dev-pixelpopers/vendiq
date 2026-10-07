import type { Metadata } from "next";
import { Montserrat, Rajdhani } from "next/font/google";
import "./globals.css";
import Header from "@/components/sections/Header";
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["500", "700"],
  subsets: ["latin"],
});

// Stand-in for Gotham (used in the Figma file), which isn't on Google Fonts.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VendIQ — Smart Vending Reimagined",
  description:
    "Intelligent vending and micro-market solutions designed for modern workplaces.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${montserrat.variable} relative h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
