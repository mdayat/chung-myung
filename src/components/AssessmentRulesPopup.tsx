import { CheckboxIcon } from "@components/icons/CheckboxIcon";
import { CheckboxOutlineBlankIcon } from "@components/icons/CheckboxOutlineBlankIcon";
import { Button } from "@components/shadcn/Button";
import {
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@components/shadcn/Dialog";
import { Typography } from "@components/shadcn/Typography";
import Link from "next/link";
import { type MouseEvent, useRef, useState } from "react";

export function AssessmentRulesPopup() {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [isChecked, setIsChecked] = useState(false);

  function toggleAssessmentRules() {
    setIsChecked(!isChecked);
  }

  function handleClickButton() {
    anchorRef.current?.click();
  }

  function handleButtonOnHover(event: MouseEvent<HTMLButtonElement>) {
    anchorRef.current?.focus({ preventScroll: true });
    event.currentTarget.addEventListener("click", handleClickButton, {
      once: true,
    });
  }

  function handleButtonOnBlur(event: MouseEvent<HTMLButtonElement>) {
    anchorRef.current?.blur();
    event.currentTarget.removeEventListener("click", handleClickButton);
  }

  return (
    <>
      <DialogTitle asChild>
        <Typography
          as='h3'
          variant='h5'
          weight='bold'
          className='mb-2 text-neutral-700'
        >
          Peraturan Asesmen
        </Typography>
      </DialogTitle>

      <DialogDescription asChild>
        <Typography variant='b3' className='mb-6 text-neutral-500'>
          Pastikan kamu membaca seluruh peraturan asesmen ini.
        </Typography>
      </DialogDescription>

      <ol className='mb-4 ml-6 list-decimal'>
        <li>
          <Typography variant='b3' className='text-neutral-500'>
            Kamu memiliki 3 kali kesempatan untuk mengerjakan asesmen ini.
          </Typography>
        </li>
        <li>
          <Typography variant='b3' className='text-neutral-500'>
            Kerjakan dengan jujur agar hasilnya benar-benar mencerminkan
            pemahaman kamu.
          </Typography>
        </li>
      </ol>

      <button
        onClick={toggleAssessmentRules}
        type='button'
        className='mb-6 flex items-center gap-x-1.5'
      >
        {isChecked ? (
          <CheckboxIcon className='h-5 w-5 fill-secondary-600' />
        ) : (
          <CheckboxOutlineBlankIcon className='h-5 w-5' />
        )}

        <Typography variant='b3' className='text-neutral-500'>
          Saya sudah membaca peraturan asesmen.
        </Typography>
      </button>

      <DialogFooter>
        <Button
          onMouseEnter={handleButtonOnHover}
          onMouseLeave={handleButtonOnBlur}
          disabled={isChecked === false}
          className='block w-full text-center'
        >
          Mulai Asesmen
          <Link ref={anchorRef} href='/asesmen-kesiapan-belajar'></Link>
        </Button>
      </DialogFooter>
    </>
  );
}
