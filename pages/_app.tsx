import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${geistSans.className} ${geistMono.className} antialiased`}
    >
      <Component {...pageProps} />
    </main>
  );
}
