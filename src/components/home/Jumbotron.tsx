import Image from "next/image";

import { Button } from "@components/Button";
import { Typography } from "@components/Typography";

import RubahImage from "@images/home/rubah2.png";

export function Jumbotron() {
  return (
    <section className="">
      <figure className="flex justify-between items-center bg-[url('/images/home/background.png')] relative px-20 min-h-[155px] bg-cover bg-right">
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
            src={RubahImage}
            alt="Sobat Emteka"
            className="object-contain"
            fill
          />
        </div>
      </figure>

      <div className="flex  items-center py-2 bg-secondary-200 text-center justify-center gap-x-2 rounded-b-2xl">
        <Typography variant="p3" className="text-neutral-500">
          Bagaimana kesan kamu menggunakan Emteka?
        </Typography>

        <Button size="small" className="py-2">
          Nilai Sekarang
        </Button>
      </div>
    </section>
  );
}
