import { Dispatch } from "react";
import Image from "next/image";
import type { SetStateAction } from "react";

import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";

import { AsesmenRulesPopup } from "@components/home/AsesmenRulesPopup";

import type { StartAKB } from "@customTypes/homeakb";

import { ChevronRightIcon } from "@components/icons/ChevronRightIcon";
import MaskotBodyImage from "@public/maskot-body.png";

interface HomeMulaiAKBProps extends StartAKB {
  isOpenPopup: boolean;
  setIsOpenPopup: Dispatch<SetStateAction<boolean>>;
}

export function HomeMulaiAKB({
  isOpenPopup,
  isStartAsesmen = "",
  setIsOpenPopup,
  setStartAsesmen,
}: HomeMulaiAKBProps) {
  function openRulesAkb() {
    setIsOpenPopup(true);
  }

  return (
    <>
      <section className="flex justify-between max-h-[256px] overflow-hidden mx-10 mt-6 rounded-xl shadow-lg border-t-2 border-neutral-50 xl:w-[1206px] xl:mx-auto bg-neutral-0">
        <div className="w-[600px] relative z-10">
          <Image
            src={MaskotBodyImage}
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
            onClick={openRulesAkb}
            className="mt-6 mb-2"
            disabled={isStartAsesmen === "asesmen-berlangsung" ? true : false}
          >
            Mulai Asesmen Kesiapan Belajar
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
          <Typography variant="p4" className="text-neutral-400">
            {"*"}Saat ini, kamu hanya bisa belajar materi Bidang Ruang. Materi
            tambahan akan segera hadir!
          </Typography>
        </div>
      </section>

      <AsesmenRulesPopup
        isOpenPopup={isOpenPopup}
        setIsClosePopup={setIsOpenPopup}
        setStartAsesmen={setStartAsesmen}
      />
    </>
  );
}
