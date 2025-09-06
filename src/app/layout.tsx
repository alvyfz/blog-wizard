import type { Metadata } from "next";
import "./globals.css";
import { geistSans } from "@/lib/fonts";
import { isDevEnv } from "@/lib/utils";
import { AlertProvider } from "@/contexts/alert-context";

export const metadata: Metadata = {
  title: {
    template: "%s | Blog Wizard",
    default: "Blog Wizard",
  },
  description: "A platform for writing, reading, and sharing ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased ${
          isDevEnv ? "debug-screens" : ""
        }`}
      >
        <AlertProvider>{children}</AlertProvider>
      </body>
    </html>
  );
}
