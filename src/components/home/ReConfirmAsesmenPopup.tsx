import Image from "next/image";
import { Dispatch } from "react";

import { Button } from "@components/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogFooter,
} from "@components/shadcn/Dialog";
import { Typography } from "@components/shadcn/Typography";
import type { SetStateAction } from "react";

import type { StartAKB } from "@customTypes/homeakb";

import MaskotHeadImages from "@public/maskot-head.png";

interface PopupProps extends StartAKB {
  isOpenPopup: boolean;
  setIsClosePopup: Dispatch<SetStateAction<boolean>>;
}

export function ReConfirmAsesmenPopup({
  isOpenPopup = false,
  setIsClosePopup,
  setStartAsesmen,
}: PopupProps) {
  function AsesmenLanjutkan() {
    setIsClosePopup(false);
  }

  function AsesmenBerhenti() {
    setStartAsesmen("");
    setIsClosePopup(false);
  }
  return (
    <Dialog onOpenChange={setIsClosePopup} open={isOpenPopup}>
      <DialogOverlay>
        <DialogContent className="min-w-[528px] max-h-[411px]">
          <DialogHeader className="flex justify-center">
            <Image
              src={MaskotHeadImages}
              alt="Maskot Head"
              className="object-contain w-[180px] h-[180px]"
            />
          </DialogHeader>
          <DialogDescription className="flex flex-col space-y-3 items-center max-w-[388px] mx-auto">
            <Typography variant="h5" className="text-center" weight="bold">
              Apakah Kamu yakin ingin{" "}
              <span className="text-error-600">memulai ulang</span> asesmen?
            </Typography>

            <Typography variant="b2" className="" weight="light">
              Semua progres sebelumnya akan hilang.
            </Typography>
          </DialogDescription>

          <DialogFooter className="mt-6 grid grid-cols-2 gap-x-4">
            <Button
              variant="secondary"
              onClick={AsesmenLanjutkan}
              className="justify-center"
            >
              Batal
            </Button>
            <Button onClick={AsesmenBerhenti} className="justify-center">
              Ya
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
