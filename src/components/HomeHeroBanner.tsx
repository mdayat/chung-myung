import Image from "next/image";
import { Typography } from "@components/shadcn/Typography";
import MaskotHeadImage from "@public/maskot-head.png";
import EmtekaBannerImage from "@public/emteka-banner.jpg";

export function HomeHeroBanner() {
  return (
    <div className="relative">
      <Image
        src={EmtekaBannerImage}
        alt="Emteka Banner"
        className="object-cover object-center -z-10"
        fill
      />

      <div className="flex justify-between items-center w-full max-w-[calc(1366px-160px)] h-full max-h-[155px] mx-auto">
        <div>
          <Typography
            as="h1"
            variant="h2"
            className="text-neutral-0 mb-1"
            weight="bold"
          >
            Selamat datang, Sobat Emteka
          </Typography>

          <Typography variant="b3" className="text-neutral-0">
            Tingkatkan terus kemampuan matematika Anda bersama Emteka
          </Typography>
        </div>

        <Image
          src={MaskotHeadImage}
          width={204}
          height={204}
          alt="Emteka Maskot (Head)"
          className="object-cover object-center translate-y-2.5"
        />
      </div>
    </div>
  );
}
