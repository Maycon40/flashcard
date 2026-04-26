import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SWRConfig } from "swr";

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
      <SWRConfig
        value={{
          shouldRetryOnError: false,
          revalidateOnFocus: false,
          onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            if (error.status === 404) return;
            if (retryCount >= 3) return;
            setTimeout(() => revalidate({ retryCount }), 5000);
          },
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
      <GoogleAnalytics gaId={process.env.GA_ID || ""} />
      <Analytics />
      <SpeedInsights />
    </main>
  );
}
