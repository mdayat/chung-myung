import Image from "next/image";

import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";

import { ChevronRight } from "@components/icons/ChevronRight";
import RubahImage from "@images/home/rubah1.png";

export function AsesmenStart() {
  return (
    <section className="flex justify-between max-h-[280px] overflow-hidden mx-20 mt-8 rounded-xl shadow-lg border-t-2 border-neutral-50">
      <div className="w-[600px] relative">
        <Image
          src={RubahImage}
          alt="Sobat Emteka"
          className="object-contain w-[422px] h-[422px]"
        />

        <div className="w-[300px] h-[200px] block absolute rounded-tr-md bg-secondary-100 -bottom-10 -left-10 rounded- blur-md -z-10" />
      </div>
      <div className="w-[900px] mr-20 mt-10">
        <Typography variant="h3" className="mb-3" weight="bold">
          Mulai Belajar
        </Typography>
        <Typography variant="p2" className="text-neutral-500" weight="normal">
          Mari mulai belajar! Ikuti asesmen kesiapan belajar, pelajari materi
          yang kami sediakan, dan selesaikan dengan final asesmen.
        </Typography>

        <Button className="mt-6 mb-2">
          Mulai Asesmen Kesiapan Belajar <ChevronRight className="w-5 h-5" />
        </Button>
        <Typography variant="p4" className="text-neutral-400">
          {"*"}Saat ini, kamu hanya bisa belajar materi Bidang Ruang. Materi
          tambahan akan segera hadir!
        </Typography>
      </div>
    </section>
  );
}
