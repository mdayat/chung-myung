import { Typography } from "@components/shadcn/Typography";
import EmtekaBannerImage from "@public/emteka-banner.jpg";
import MaskotHeadImage from "@public/maskot-head.png";
import Image from "next/image";

export function HomeHeroBanner() {
  return (
    <div className='relative'>
      <Image
        src={EmtekaBannerImage}
        alt='Emteka Banner'
        className='-z-10 object-cover object-center'
        fill
      />

      <div className='mx-auto flex h-full max-h-[155px] w-full max-w-[calc(1366px-160px)] items-center justify-between'>
        <div>
          <Typography
            as='h1'
            variant='h2'
            className='mb-1 text-neutral-0'
            weight='bold'
          >
            Selamat datang, Sobat Emteka
          </Typography>

          <Typography variant='b3' className='text-neutral-0'>
            Tingkatkan terus kemampuan matematika Anda bersama Emteka
          </Typography>
        </div>

        <Image
          src={MaskotHeadImage}
          width={204}
          height={204}
          alt='Emteka Maskot (Head)'
          className='translate-y-2.5 object-cover object-center'
        />
      </div>
    </div>
  );
}
