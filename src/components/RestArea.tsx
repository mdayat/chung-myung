import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";
import MaskotHeadImages from "@public/maskot-head.png";
import type { Subtest } from "@utils/assessmentTracker";
import Image from "next/image";
import type { PropsWithChildren } from "react";

import { BlurredCircle } from "./BlurredCircle";
import { AssignmentIcon } from "./icons/AssignmentIcon";
import { CalculateIcon } from "./icons/CalculateIcon";
import { TimerIcon } from "./icons/TimerIcon";
import { Progress } from "./shadcn/Progress";

interface RestAreaProps {
  timer: number;
  subtestsLength: number;
  completedSubtestIndex: number;
  nextSubtest: Subtest;
  nextSubtestQuestionsLength: number;
  handleClickNextSubtest: () => void;
}

function RestArea({
  timer,
  subtestsLength,
  completedSubtestIndex,
  nextSubtest,
  nextSubtestQuestionsLength,
  handleClickNextSubtest,
}: RestAreaProps) {
  return (
    <>
      <BlurredCircle className='absolute bottom-[-42px] left-[-42px] h-[184px] w-[184px]' />
      <div className='absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-neutral-700 p-8'>
        <div className='flex items-center justify-center gap-x-6 rounded-2xl bg-primary-500 py-2'>
          <Typography
            as='span'
            variant='h6'
            weight='bold'
            className='flex h-12 w-12 items-center justify-center rounded-full bg-neutral-0 text-neutral-950'
          >
            {completedSubtestIndex + 1}/{subtestsLength}
          </Typography>

          <Typography
            as='p'
            variant='h6'
            weight='bold'
            className='text-neutral-0'
          >
            Subtes selesai dikerjakan
          </Typography>
        </div>

        <Image
          src={MaskotHeadImages}
          width={180}
          height={180}
          alt='Emteka Maskot (Head)'
          className='mx-auto object-cover object-center'
        />

        <Typography
          as='h1'
          variant='h5'
          weight='bold'
          className='mb-4 text-center text-neutral-950'
        >
          Saatnya Beristirahat!
        </Typography>

        <Typography variant='b3' className='text-center text-neutral-500'>
          Kamu telah bekerja keras!
          <br /> Mari luangkan waktu sejenak untuk beristirahat agar pikiranmu
          lebih segar.
        </Typography>

        <hr className='mb-6 mt-4 h-[1px] w-full bg-neutral-300' />

        <Typography
          variant='b3'
          weight='bold'
          className='mb-6 text-center text-neutral-500'
        >
          Otomatis ke subtes selanjutnya dalam
        </Typography>

        <div className='mb-4 flex items-center justify-center gap-x-1'>
          <Typography
            as='span'
            variant='h3'
            weight='bold'
            className='text-neutral-700'
          >
            {timer}
          </Typography>

          <Typography variant='b3' className='text-neutral-500'>
            detik
          </Typography>
        </div>

        <Progress value={timer} max={20} className='mb-6' />

        <div className='mb-8 flex items-center justify-between gap-x-6'>
          <NextSubtestInfo title='Judul Subtes' description={nextSubtest.name}>
            <AssignmentIcon />
          </NextSubtestInfo>

          <NextSubtestInfo
            title='Jumlah Soal'
            description={String(nextSubtestQuestionsLength)}
          >
            <CalculateIcon />
          </NextSubtestInfo>

          <NextSubtestInfo title='Waktu Pengerjaan' description='20 menit'>
            <TimerIcon />
          </NextSubtestInfo>
        </div>

        <Button onClick={handleClickNextSubtest} className='mx-auto block'>
          Lanjutkan Subtes Selanjutnya
        </Button>
      </div>
    </>
  );
}

interface NextSubtestInfoProps extends PropsWithChildren {
  title: string;
  description: string;
}

function NextSubtestInfo({
  children,
  title,
  description,
}: NextSubtestInfoProps) {
  return (
    <div className='flex items-center justify-between gap-x-2'>
      <div className='flex h-10 w-10 items-center justify-center rounded-full border border-secondary-400 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:shrink-0 [&_svg]:fill-secondary-400'>
        {children}
      </div>

      <div className='flex flex-col justify-between gap-y-0.5'>
        <Typography variant='b3' weight='bold' className='text-neutral-950'>
          {title}
        </Typography>
        <Typography variant='b4' className='text-neutral-500'>
          {description}
        </Typography>
      </div>
    </div>
  );
}

export { RestArea };
