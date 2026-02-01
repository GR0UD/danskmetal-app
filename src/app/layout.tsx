import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

export const metadata: Metadata = {
  title: "Dansk Metal - Sandwich Bestilling",
  description: "Bestil sandwiches til dit team med QR-koder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" data-scroll-behavior="smooth">
      <body className={`${poppins.variable} ${inter.variable}`}>
        <Header />
        {children}
        <ToastContainer position="bottom-center" autoClose={3000} />
      </body>
    </html>
  );
}
