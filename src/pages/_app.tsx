import type { AppProps } from "next/app";
import { Karla, Nunito } from "next/font/google";
import Script from "next/script";

import "../styles/global.css";

const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
});

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <main className={`${karla.variable} ${nunito.variable} font-karla`}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
