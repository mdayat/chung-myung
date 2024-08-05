import type { LearningMaterial } from "@customTypes/learningMaterial";
import MaskotHeadImage from "@public/maskot-head.png";
import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, useRef } from "react";

import { WarningIcon } from "./icons/WarningIcon";
import { Typography } from "./shadcn/Typography";

interface LearningMaterialWithStatus
  extends Omit<LearningMaterial, "description" | "number"> {
  isStudied: boolean;
}

export function LearningMaterialCard({
  id,
  name,
  type,
  isStudied,
}: LearningMaterialWithStatus) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  function handleClickCard() {
    anchorRef.current?.click();
  }

  function handleCardOnHover(event: MouseEvent<HTMLDivElement>) {
    anchorRef.current?.focus();
    event.currentTarget.addEventListener("click", handleClickCard, {
      once: true,
    });
  }

  function handleCardOnBlur(event: MouseEvent<HTMLDivElement>) {
    anchorRef.current?.blur();
    event.currentTarget.removeEventListener("click", handleClickCard);
  }

  return (
    <div
      onMouseEnter={handleCardOnHover}
      onMouseLeave={handleCardOnBlur}
      className='relative h-[238px] w-[252px] shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.15)]'
    >
      <Link
        ref={anchorRef}
        href={`/${window.location.pathname.split("/")[1]}/belajar-materi/${id}`}
      ></Link>

      {type === "prerequisite" ? (
        <div className='absolute flex items-center justify-between gap-x-2 rounded-br-2xl border-b border-r border-b-warning-500 border-r-warning-500 bg-warning-200 p-2.5'>
          <WarningIcon className='h-4 w-4 fill-warning-600' />
          <Typography variant='b4' weight='bold' className='text-neutral-900'>
            Materi Prasyarat
          </Typography>
        </div>
      ) : (
        <></>
      )}

      <Image
        src={MaskotHeadImage}
        alt={name}
        className='h-[142px] w-full bg-neutral-900 object-cover object-center'
      />

      <Typography
        as='h2'
        variant='h6'
        weight='bold'
        className='mx-3 mt-4 text-neutral-700'
      >
        {name}
      </Typography>

      <Typography
        variant='b4'
        className='absolute bottom-4 left-3 text-neutral-400'
      >
        {isStudied ? "Sudah Dipelajari" : "Belum Dipelajari"}
      </Typography>
    </div>
  );
}
