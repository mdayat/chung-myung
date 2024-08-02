import { Typography } from "@components/shadcn/Typography";
import Gambar from "@public/Coba.jpg";
import Image from "next/image";

import { WarningIcon } from "./icons/WarningIcon";

interface MateriProps {
  name: string;
  type: string;
}

export function MateriCard({ name, type }: MateriProps) {
  return (
    <div className='relative h-[238px] w-[252px] rounded-xl shadow-2xl'>
      {type === "prerequisite" ? (
        <div className='absolute flex rounded-br-xl rounded-tl-xl bg-warning-200 p-2'>
          <WarningIcon className='mr-3 h-5 w-5 fill-warning-600' />
          <Typography variant='b4' className='' weight='bold'>
            Materi Prasyarat
          </Typography>
        </div>
      ) : (
        ""
      )}

      <Image
        src={Gambar}
        alt='Gambar'
        className='h-[142px] w-full rounded-t-xl object-cover'
      />

      <Typography variant='h6' weight='bold' className='px-2 py-4'>
        {name}
      </Typography>
      <div className='absolute bottom-1 px-2'>
        <Typography variant='b3' weight='normal' className='text-neutral-500'>
          Belum Dipelajari
        </Typography>
      </div>
    </div>
  );
}
