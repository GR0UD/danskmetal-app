"use client";

import { Poppins, Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import Header from "@/components/header";

import "@/styles/main.scss";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showHeader = pathname !== "/";

  return (
    <html lang="da" data-scroll-behavior="smooth">
      <body className={`${poppins.variable} ${inter.variable}`}>
        {showHeader && <Header />}
        {children}
        <ToastContainer position="bottom-center" autoClose={3000} />
      </body>
    </html>
  );
}
