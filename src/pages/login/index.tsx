import Image from "next/image";
import Script from "next/script";
import type { ReactElement } from "react";

import { EmtekaLogo } from "@components/icons/EmtekaLogo";
import { Typography } from "@components/shadcn/Typography";
import { BlurredCircle } from "@components/BlurredCircle";
import { karla, nunito } from "@utils/fonts";
import MaskotHeadImage from "@public/maskot-head.png";
import type { NextPageWithLayout } from "../_app";

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />

      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border border-neutral-300 rounded-3xl w-full max-w-[556px] p-8">
        <EmtekaLogo className="w-40 mx-auto" />
        <div className="relative">
          <Image
            src={MaskotHeadImage}
            width={204}
            height={204}
            alt="Emteka Maskot (Head)"
            className="object-cover object-center mx-auto"
          />
          <div className="bg-secondary-200 rounded-2xl absolute bottom-[26px] -z-10 w-full h-2"></div>
        </div>

        <Typography
          as="h1"
          variant="h2"
          weight="bold"
          className="text-neutral-700 text-center mb-4"
        >
          Selamat datang di Emteka!
        </Typography>

        <Typography variant="b3" className="text-neutral-500 text-center mb-8">
          Masuk menggunakan akun Google untuk mulai belajar matematika dengan
          cara yang menyenangkan.
        </Typography>

        <div className="w-full max-w-[400px] mx-auto">
          <div
            id="g_id_onload"
            data-client_id="2931290381290312"
            data-context="signin"
            data-ux_mode="popup"
            data-login_uri="ethaniel"
            data-auto_prompt="false"
          ></div>

          <div
            className="g_id_signin font-bold"
            data-type="standard"
            data-shape="pill"
            data-theme="filled_blue"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left"
          ></div>
        </div>
      </div>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <main
      className={`${karla.variable} ${nunito.variable} bg-neutral-50 font-karla relative overflow-hidden w-screen h-screen`}
    >
      <BlurredCircle className="absolute top-[-42px] right-[-42px] w-[184px] h-[184px]" />
      {page}
      <BlurredCircle className="absolute bottom-[-42px] left-[-42px] w-[184px] h-[184px]" />
    </main>
  );
};

export default Login;
