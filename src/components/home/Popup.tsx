import { Dispatch, useState } from "react";
import { Button } from "@components/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogFooter,
} from "@components/shadcn/Dialog";
import { Typography } from "@components/shadcn/Typography";
import type { SetStateAction } from "react";
import { CheckboxIcon } from "@components/icons/CheckboxIcon";
import { CheckboxOutlineBlankIcon } from "@components/icons/CheckboxOutlineBlankIcon";

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

  return (
    <Dialog onOpenChange={setIsClosePopup} open={isOpenPopup}>
      <DialogOverlay>
        <DialogContent className="w-[526px] min-h-[395px]">
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
              {remember ? (
                <button onClick={() => setRemember(false)} type="button">
                  <CheckboxIcon className="fill-secondary-600 w-6 h-6" />
                </button>
              ) : (
                <button onClick={() => setRemember(true)} type="button">
                  <CheckboxOutlineBlankIcon className="fill-neutral-900 w-6 h-6" />
                </button>
              )}

              <label
                onClick={() => setRemember(!remember)}
                htmlFor="remember"
                className="text-base select-none cursor-pointer"
              >
                Saya sudah membaca peraturan asesmen.
              </label>
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
