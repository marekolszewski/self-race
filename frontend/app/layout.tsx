import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Self-Race Terminal",
  description: "Birthday Race Token Claim Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
