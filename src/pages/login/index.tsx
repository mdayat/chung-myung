import React from "react";
import Image from "next/image";
import Script from "next/script";

import { EmtekaLogo } from "@components/icons/EmtekaLogo";
import MaskotHead from "@public/maskot-head.png";
import { Typography } from "@components/shadcn/Typography";

export default function Login() {
  return (
    <div className="overflow-x-hidden overflow-y-clip">
      <Script src="https://accounts.google.com/gsi/client" />
      <div className="w-screen h-screen flex justify-center items-center overflow-y-hidden">
        <div className="absolute w-24 h-24 bg-secondary-100/80 -top-4 right-0 rounded-full blur z-10" />
        <div className="border-2 border-neutral-200 rounded-xl p-5 flex-col justify-center items-center max-w-[600px]">
          <section className="w-full flex justify-center">
            <div className="w-[200px] h-fit">
              <EmtekaLogo />
            </div>
          </section>

          <section className="w-full flex justify-center">
            <div className="w-[200px] h-[200px]">
              <Image src={MaskotHead} alt="Maskot Head Login" />
            </div>
          </section>
          <div className="h-3 w-[492px] bg-secondary-200 -mt-8 rounded-lg mx-auto"></div>

          <Typography
            variant="h2"
            className="text-neutral-950 mx-auto w-fit mt-5"
            weight="bold"
          >
            Selamat Datang Di Emteka
          </Typography>
          <Typography
            variant="h6"
            className="text-neutral-700 mx-auto w-fit mt-5 text-center"
            weight="normal"
          >
            Masuk menggunakan akun Google untuk mulai belajar matematika dengan
            cara yang menyenangkan.
          </Typography>
          <div className="w-[300px] mx-auto mt-10">
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
        <div className="absolute w-24 h-24 bg-secondary-100 -bottom-4 left-0 rounded-full blur z-10" />
      </div>
    </div>
  );
}
