import { BlurredCircle } from "@components/BlurredCircle";
import { EmtekaLogo } from "@components/icons/EmtekaLogo";
import { Typography } from "@components/shadcn/Typography";
import MaskotHeadImage from "@public/maskot-head.png";
import { karla, nunito } from "@utils/fonts";
import Image from "next/image";
import Script from "next/script";
import type { ReactElement } from "react";

import type { NextPageWithLayout } from "../_app";

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Script src='https://accounts.google.com/gsi/client' />

      <div className='absolute left-1/2 top-1/2 w-full max-w-[556px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-neutral-300 p-8'>
        <EmtekaLogo className='mx-auto w-40' />
        <div className='relative'>
          <Image
            src={MaskotHeadImage}
            width={204}
            height={204}
            alt='Emteka Maskot (Head)'
            className='mx-auto object-cover object-center'
          />
          <div className='absolute bottom-[26px] -z-10 h-2 w-full rounded-2xl bg-secondary-200'></div>
        </div>

        <Typography
          as='h1'
          variant='h2'
          weight='bold'
          className='mb-4 text-center text-neutral-700'
        >
          Selamat datang di Emteka!
        </Typography>

        <Typography variant='b3' className='mb-8 text-center text-neutral-500'>
          Masuk menggunakan akun Google untuk mulai belajar matematika dengan
          cara yang menyenangkan.
        </Typography>

        <div className='mx-auto w-full max-w-[400px]'>
          <div
            id='g_id_onload'
            data-client_id='2931290381290312'
            data-context='signin'
            data-ux_mode='popup'
            data-login_uri='ethaniel'
            data-auto_prompt='false'
          ></div>

          <div
            className='g_id_signin font-bold'
            data-type='standard'
            data-shape='pill'
            data-theme='filled_blue'
            data-text='signin_with'
            data-size='large'
            data-logo_alignment='left'
          ></div>
        </div>
      </div>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <main
      className={`${karla.variable} ${nunito.variable} relative h-screen w-screen overflow-hidden bg-neutral-50 font-karla`}
    >
      <BlurredCircle className='absolute right-[-42px] top-[-42px] h-[184px] w-[184px]' />
      {page}
      <BlurredCircle className='absolute bottom-[-42px] left-[-42px] h-[184px] w-[184px]' />
    </main>
  );
};

export default Login;
