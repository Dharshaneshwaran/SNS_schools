import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNS ERP Login",
  description: "Login page for the SNS ERP web client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
