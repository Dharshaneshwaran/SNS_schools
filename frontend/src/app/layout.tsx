import type { Metadata } from "next";
import { AppProviders } from "../components/providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNS ERP",
  description: "Attendance, timetable, and substitution management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
