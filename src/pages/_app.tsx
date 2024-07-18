import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

import { HelpMenu, Navbar, ProfileMenu } from "@components/Navbar";
import { karla, nunito } from "@utils/fonts";
import "../styles/global.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ??
    ((page: ReactElement) => {
      return (
        <>
          <Navbar>
            <HelpMenu />
            <ProfileMenu withIcon />
          </Navbar>

          <main className={`${karla.variable} ${nunito.variable} font-karla`}>
            {page}
          </main>
        </>
      );
    });

  return getLayout(<Component {...pageProps} />);
}
