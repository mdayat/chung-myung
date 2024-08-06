import MaskotHeadImage from "@public/maskot-head.png";
import Image from "next/image";
import Link from "next/link";

import { ChevronLeftIcon } from "./icons/ChevronLeftIcon";
import { ChevronRightIcon } from "./icons/ChevronRightIcon";
import { Button } from "./shadcn/Button";
import { Progress } from "./shadcn/Progress";
import { Typography } from "./shadcn/Typography";

interface BelajarMateriHeaderProps {
  materialName: string;
  totalStudiedLearningMaterials: number;
  totalLearningMaterials: number;
}

export function BelajarMateriHeader({
  materialName,
  totalLearningMaterials,
  totalStudiedLearningMaterials,
}: BelajarMateriHeaderProps) {
  return (
    <div className='relative max-h-[180px] overflow-hidden bg-secondary-500 py-5'>
      <div className='absolute -right-8 top-1/2 h-[548px] w-[536px] -translate-y-1/2 rounded-full bg-secondary-600' />
      <div className='absolute right-0 top-1/2 h-[548px] w-[536px] -translate-y-1/2 rounded-full bg-secondary-600 opacity-60' />

      <div className='mx-auto w-full max-w-[calc(1366px-256px)]'>
        <Link
          href='/'
          className='mb-6 flex h-fit w-fit items-center justify-start gap-x-2'
        >
          <ChevronLeftIcon className='h-6 w-6 fill-secondary-50' />
          <Typography className='text-secondary-50' variant='b3' weight='bold'>
            Kembali
          </Typography>
        </Link>

        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-between gap-x-6'>
            <Image
              src={MaskotHeadImage}
              alt='Emteka Maskot (Head)'
              width={100}
              height={100}
            />

            <div className='flex flex-col gap-y-4'>
              <Typography
                as='h1'
                variant='h3'
                weight='bold'
                className='text-neutral-25'
              >
                {materialName}
              </Typography>

              <Typography
                className='text-neutral-200'
                variant='b3'
                weight='bold'
              >
                Kelas 12 - Kurikulum K13
              </Typography>
            </div>
          </div>

          <div className='z-0 flex flex-col gap-y-4'>
            <Button
              disabled={
                totalStudiedLearningMaterials !== totalLearningMaterials
              }
              className='ml-auto w-fit'
            >
              Assesmen Akhir <ChevronRightIcon className='h-6 w-6' />
            </Button>

            <div className='flex items-center gap-x-4'>
              <Progress
                value={totalStudiedLearningMaterials}
                max={totalLearningMaterials}
                indicatorColor='bg-success-500'
                className='w-[280px]'
              />

              <Typography
                variant='b3'
                weight='bold'
                className='text-neutral-25'
              >
                {Math.round(
                  (totalStudiedLearningMaterials / totalLearningMaterials) *
                    100,
                )}
                %
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
