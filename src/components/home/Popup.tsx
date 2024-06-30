import { Dispatch, useState } from "react";
import { Button } from "@components/shadcn/Button";
import { Checkbox } from "@components/shadcn/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogFooter,
} from "@components/shadcn/Dialog";
import { Label } from "@components/shadcn/Label";
import { Typography } from "@components/shadcn/Typography";
import type { SetStateAction } from "react";

interface PopupProps {
  isOpenPopup: boolean;
  setIsClosePopup: Dispatch<SetStateAction<boolean>>;
  setStartAsesmen: Dispatch<SetStateAction<string>>;
}

export function Popup({
  isOpenPopup = false,
  setIsClosePopup,
  setStartAsesmen,
}: PopupProps) {
  const [remember, setRemember] = useState(false);

  function AsesmenStartFunc() {
    setStartAsesmen("asesmen-berlangsung");
    setIsClosePopup(false);
  }

  function RememberFunc() {
    setRemember(!remember);
  }

  return (
    <Dialog onOpenChange={setIsClosePopup} open={isOpenPopup}>
      <DialogOverlay className="bg-neutral-800/30">
        <DialogContent className="bg-neutral-0 w-[526px] min-h-[395px] p-8">
          <DialogHeader>
            <div>
              <DialogTitle className="text-2xl font-bold">
                Peraturan Asesmen
              </DialogTitle>
              <DialogDescription className="text-base">
                Pastikan kamu membaca seluruh peraturan asesmen ini.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div>
            <ul className="list-decimal flex px-5 flex-col gap-y-0.5 text-justify">
              <li>
                <Typography variant="p3">
                  Asesmen ini akan menguji kemampuan anda pada materi prasyarat
                  dari Bidang Ruang
                </Typography>
              </li>
              <li>
                <Typography variant="p3">
                  Materi Bidang Ruang memiliki 3 sub-materi dan setiap
                  sub-materi memiliki 9 soal.
                </Typography>
              </li>
              <li>
                <Typography variant="p3">
                  Anda harus mendapatkan nilai sempurna atau anda harus belajar
                  materi prasyarat yang anda belum kuasai
                </Typography>
              </li>
              <li>
                <Typography variant="p3">
                  Selama asesmen, dilarang menggunakan bahan referensi eksternal
                  atau mencari jawaban dari luar Emteka.
                </Typography>
              </li>
            </ul>

            <form className="flex items-center gap-x-1.5 mt-[18px]">
              <Checkbox id="remember" onClick={RememberFunc} />
              <Label htmlFor="remember" className="text-base">
                Saya sudah membaca peraturan asesmen.
              </Label>
            </form>

            <DialogFooter className="mt-6">
              <Button
                className="w-full justify-center"
                disabled={remember ? false : true}
                onClick={AsesmenStartFunc}
              >
                Mulai Asesmen
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
