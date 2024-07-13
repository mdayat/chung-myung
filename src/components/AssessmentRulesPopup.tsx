import Link from "next/link";
import { useState } from "react";

import {
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@components/shadcn/Dialog";
import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";
import { CheckboxIcon } from "@components/icons/CheckboxIcon";
import { CheckboxOutlineBlankIcon } from "@components/icons/CheckboxOutlineBlankIcon";

export function AssessmentRulesPopup() {
  const [isChecked, setIsChecked] = useState(false);

  function toggleAssessmentRules() {
    setIsChecked(!isChecked);
  }

  return (
    <>
      <DialogTitle asChild>
        <Typography
          as="h3"
          variant="h5"
          weight="bold"
          className="text-neutral-700 mb-2"
        >
          Peraturan Asesmen
        </Typography>
      </DialogTitle>

      <DialogDescription asChild>
        <Typography variant="b3" className="text-neutral-500 mb-6">
          Pastikan kamu membaca seluruh peraturan asesmen ini.
        </Typography>
      </DialogDescription>

      <ol className="list-decimal mb-4 ml-6">
        <li>
          <Typography variant="b3" className="text-neutral-500">
            Asesmen ini akan menguji kemampuan anda pada materi prasyarat dari
            Bidang Ruang
          </Typography>
        </li>
        <li>
          <Typography variant="b3" className="text-neutral-500">
            Materi Bidang Ruang memiliki 3 sub-materi dan setiap sub-materi
            memiliki 9 soal.
          </Typography>
        </li>
        <li>
          <Typography variant="b3" className="text-neutral-500">
            Anda harus mendapatkan nilai sempurna atau anda harus belajar materi
            prasyarat yang anda belum kuasai
          </Typography>
        </li>
        <li>
          <Typography variant="b3" className="text-neutral-500">
            Selama asesmen, dilarang menggunakan bahan referensi eksternal atau
            mencari jawaban dari luar Emteka.
          </Typography>
        </li>
      </ol>

      <button
        onClick={toggleAssessmentRules}
        type="button"
        className="flex items-center gap-x-1.5 mb-6"
      >
        {isChecked ? (
          <CheckboxIcon className="fill-secondary-600 w-5 h-5" />
        ) : (
          <CheckboxOutlineBlankIcon className="w-5 h-5" />
        )}

        <Typography variant="b3" className="text-neutral-500">
          Saya sudah membaca peraturan asesmen.
        </Typography>
      </button>

      <DialogFooter>
        <Button
          disabled={isChecked === false}
          className="block text-center w-full"
          asChild
        >
          <Link href="/asesmen-kesiapan-belajar">Mulai Asesmen</Link>
        </Button>
      </DialogFooter>
    </>
  );
}
