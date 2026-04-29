import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { AppProviders } from "../components/providers/auth-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "SNS Academy ERP | Smart School Management",
  description: "Simplifying communication between parents, teachers, and administration through innovation and design thinking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.variable} ${poppins.variable} min-h-full flex flex-col font-sans`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
