import Image from "next/image";

import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";

import MaskotHeadImage from "@public/maskot-head.png";

export function Jumbotron() {
  return (
    <section>
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
            <Typography variant="p3" className="text-neutral-50">
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

      <div className="flex items-center xl:min-h-10 py-[6px] bg-secondary-200 text-center justify-center gap-x-2 rounded-b-2xl">
        <Typography variant="p3" className="text-neutral-500">
          Bagaimana kesan kamu menggunakan Emteka?
        </Typography>

        <Button size="small">Nilai Sekarang</Button>
      </div>
    </section>
  );
}