import Image from "next/image";

import { Typography } from "@components/shadcn/Typography";

import MaskotHeadImage from "@public/maskot-head.png";

export function HomeHeroBanner() {
  return (
    <figure className="bg-[url('/emteka-banner.jpg')] relative h-[155px] bg-cover bg-right">
      <div className="flex justify-between items-center px-20 relative h-full xl:w-[1366px] xl:mx-auto">
        <div className="overflow-hidden">
          <Typography
            variant="h2"
            className="text-neutral-50 mb-1"
            weight="bold"
          >
            Selamat datang, Sobat Emteka
          </Typography>
          <Typography variant="b3" className="text-neutral-50">
            Tingkatkan terus kemampuan matematika Anda bersama Emteka
          </Typography>
        </div>

        <div className="absolute w-[204px] h-[204px] right-0 mr-40 mt-5">
          <Image
            src={MaskotHeadImage}
            alt="Sobat Emteka"
            className="object-contain"
            fill
          />
        </div>
      </div>
    </figure>
  );
}
