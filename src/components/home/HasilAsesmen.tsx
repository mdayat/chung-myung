import { Button } from "@components/Button";
import { Typography } from "@components/Typography";

import { ChevronRight } from "@components/icons/ChevronRight";
import { EmojiFlags } from "@components/icons/EmojiFlags";

export function HasilAsesmen() {
  return (
    <div className="bg-neutral-0 shadow-lg border-t-2 border-neutral-50 flex p-5 rounded-xl relative">
      <div className="absolute w-20 h-20 block bg-secondary-100/80 top-0 left-0 rounded-full blur" />
      <div className="relative">
        <EmojiFlags className="w-8 h-8 fill-secondary-500" />
      </div>

      <div className="flex py-2 ml-10 items-center justify-between w-full">
        <div className="max-w-[293px] mr-10">
          <Typography variant="h5" weight="bold" className="mb-1.5">
            Hasil Asesmen Kesiapan Belajar
          </Typography>
          <Typography variant="p3" className="text-neutral-400">
            Lihat kembali hasil asesmen kesiapan belajar yang telah kamu
            kerjakan.
          </Typography>
        </div>

        <Button size="medium" disabled>
          Lihat hasil <ChevronRight className="w-7 h-7" />
        </Button>
      </div>
    </div>
  );
}
