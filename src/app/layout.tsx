import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/main.scss";

const raleway = Raleway({
  variable: "--font-raleway",
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
      <body className={raleway.variable}>
        {children}
        <ToastContainer position="bottom-center" autoClose={3000} />
      </body>
    </html>
  );
}
