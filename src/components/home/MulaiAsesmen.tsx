import { Dispatch } from "react";
import Image from "next/image";
import type { SetStateAction } from "react";

import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";

import { ChevronRight } from "@components/icons/ChevronRight";
import RubahImage from "@images/home/rubah1.png";

interface AsesmenStartProps {
  startAsesmen: string;
  setStartAsesmen: Dispatch<SetStateAction<string>>;
}

export function AsesmenStart({
  startAsesmen = "",
  setStartAsesmen,
}: AsesmenStartProps) {
  function SetMulaiAsesmen() {
    setStartAsesmen("asesmen-berlangsung");
  }

  return (
    <section className="flex justify-between max-h-[256px] overflow-hidden mx-10 mt-6 rounded-xl shadow-lg border-t-2 border-neutral-50 xl:w-[1206px] xl:mx-auto bg-neutral-0">
      <div className="w-[600px] relative z-10">
        <Image
          src={RubahImage}
          alt="Sobat Emteka"
          className="object-contain w-[422px] h-[390px]"
        />

        <div className="w-[300px] h-[200px] block absolute rounded-tr-md bg-secondary-100 -bottom-10 -left-10 rounded-full blur-md -z-10" />
      </div>
      <div className="w-[900px] mr-20 mt-10">
        <Typography variant="h3" className="mb-3" weight="bold">
          Mulai Belajar
        </Typography>
        <Typography variant="p2" className="text-neutral-500" weight="normal">
          Mari mulai belajar! Ikuti asesmen kesiapan belajar, pelajari materi
          yang kami sediakan, dan selesaikan dengan final asesmen.
        </Typography>

        <Button
          type="button"
          className="mt-6 mb-2"
          onClick={SetMulaiAsesmen}
          disabled={startAsesmen === "asesmen-berlangsung" ? true : false}
        >
          Mulai Asesmen Kesiapan Belajar
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Typography variant="p4" className="text-neutral-400">
          {"*"}Saat ini, kamu hanya bisa belajar materi Bidang Ruang. Materi
          tambahan akan segera hadir!
        </Typography>
      </div>
    </section>
  );
}
