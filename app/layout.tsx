import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "The Great Books Semantic Engine",
  description:
    "Cloud-backed comparative philosophy search with login, usage metering, paired retrieval, concept percentages, and graph analysis."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="site-header">
            <div className="container header-inner">
              <Link href="/" className="brand">
                <span className="brand-mark">GB</span>
                <span>
                  <strong>The Great Books Semantic Engine</strong>
                  <small>Cloud comparative philosophy engine</small>
                </span>
              </Link>

              <nav className="nav">
                <Link href="/">Home</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/login">Login</Link>
                <Link href="/account">Account</Link>
              </nav>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}
