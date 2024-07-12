import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";

import { ChevronRightIcon } from "@components/icons/ChevronRightIcon";
import { SchoolIcon } from "@components/icons/SchoolIcon";

export function CardHasilAsesmenAkhir() {
  return (
    <figure className="bg-neutral-0 shadow-lg border-t-2 border-neutral-50 flex p-5 rounded-xl relative h-[148px] z-10 xl:overflow-hidden">
      <div className="absolute w-24 h-24 block bg-secondary-100/80 -top-4 -left-4 rounded-full blur -z-10" />
      <div className="relative">
        <SchoolIcon className="w-8 h-8 fill-secondary-500" />
      </div>

      <figcaption className="flex py-2 ml-10 items-center justify-between w-full">
        <div className="max-w-[293px] mr-10">
          <Typography variant="h5" weight="bold" className="mb-1.5">
            Hasil Final Asesmen
          </Typography>
          <Typography variant="b3" className="text-neutral-400">
            Lihat kembali bukti dari perjuanganmu belajar di Emteka.
          </Typography>
        </div>

        <Button size="medium" disabled>
          Lihat hasil <ChevronRightIcon className="w-7 h-7" />
        </Button>
      </figcaption>
    </figure>
  );
}
