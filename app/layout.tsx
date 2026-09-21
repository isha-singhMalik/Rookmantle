import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure AI Workforce",
  description:
    "Hire AI employees. Customize them for your industry. Control and secure everything they do.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
