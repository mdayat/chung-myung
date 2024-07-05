import { useState } from "react";

import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";

import { ReConfirmAsesmenPopup } from "@components/home/ReConfirmAsesmenPopup";

import type { StartAKB } from "@customTypes/homeakb";

import { WarningIcon } from "@components/icons/WarningIcon";

export function CardWarningNoCompletedAKB({
  isStartAsesmen = "",
  setStartAsesmen,
}: StartAKB) {
  const [isReConfirmAsesmen, setIsReConfirmAsesmen] = useState(false);

  function ReConfirmBtn() {
    setIsReConfirmAsesmen(true);
  }

  return (
    <>
      <section className="mx-10 xl:mx-auto xl:max-w-[1206px] xl:px-5 xl:py-4 bg-neutral-0 shadow-lg border-t-2 rounded-xl mt-6 border-neutral-50 relative flex z-10 xl:overflow-hidden items-center justify-between">
        <div className="absolute w-24 h-24 block bg-error-100/50 -top-1 -left-4 rounded-full blur -z-10" />

        <div className="flex gap-x-10 items-center">
          <div className="relative">
            <WarningIcon className="w-8 h-8 fill-error-500" />
          </div>

          <div>
            <Typography variant="h5" className="text-error-600" weight="bold">
              Asesmen Kesiapan Belajar Kamu Belum Terselesaikan!
            </Typography>
            <Typography variant="p3" className="mt-1">
              Ingin melanjutkan atau mengulang asesmen?
            </Typography>
          </div>
        </div>

        <div className="flex gap-x-4">
          <Button variant="secondary" size="small" onClick={ReConfirmBtn}>
            Mulai Ulang Asesmen
          </Button>
          <Button size="small" disabled>
            Lanjutkan Asesmen
          </Button>
        </div>
      </section>

      <ReConfirmAsesmenPopup
        isOpenPopup={isReConfirmAsesmen}
        isStartAsesmen={isStartAsesmen}
        setIsClosePopup={setIsReConfirmAsesmen}
        setStartAsesmen={setStartAsesmen}
      />
    </>
  );
}
