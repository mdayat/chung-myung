import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";
import { Progress } from "./shadcn/Progress";
import { BlurredCircle } from "./BlurredCircle";
import { AssignmentIcon } from "./icons/AssignmentIcon";
import { CalculateIcon } from "./icons/CalculateIcon";
import { TimerIcon } from "./icons/TimerIcon";
import MaskotHeadImages from "@public/maskot-head.png";
import type { Subtest } from "@utils/assessmentTracker";

interface RestAreaProps {
  timer: number;
  subtestsLength: number;
  completedSubtestIndex: number;
  nextSubtest: Subtest;
  nextSubtestQuestionsLength: number;
  handleRestAreaOnClick: () => void;
}

function RestArea({
  timer,
  subtestsLength,
  completedSubtestIndex,
  nextSubtest,
  nextSubtestQuestionsLength,
  handleRestAreaOnClick,
}: RestAreaProps) {
  return (
    <>
      <BlurredCircle className="absolute bottom-[-42px] left-[-42px] w-[184px] h-[184px]" />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border border-neutral-700 rounded-3xl w-full max-w-2xl p-8">
        <div className="bg-primary-500 rounded-2xl flex justify-center items-center gap-x-6 py-2">
          <Typography
            as="span"
            variant="h6"
            weight="bold"
            className="bg-neutral-0 text-neutral-950 rounded-full flex justify-center items-center w-12 h-12"
          >
            {completedSubtestIndex + 1}/{subtestsLength}
          </Typography>

          <Typography
            as="p"
            variant="h6"
            weight="bold"
            className="text-neutral-0"
          >
            Subtes selesai dikerjakan
          </Typography>
        </div>

        <Image
          src={MaskotHeadImages}
          width={180}
          height={180}
          alt="Emteka Maskot (Head)"
          className="object-cover object-center mx-auto"
        />

        <Typography
          as="h1"
          variant="h5"
          weight="bold"
          className="text-neutral-950 text-center mb-4"
        >
          Saatnya Beristirahat!
        </Typography>

        <Typography variant="b3" className="text-neutral-500 text-center">
          Kamu telah bekerja keras!
          <br /> Mari luangkan waktu sejenak untuk beristirahat agar pikiranmu
          lebih segar.
        </Typography>

        <hr className="bg-neutral-300 w-full h-[1px] mt-4 mb-6" />

        <Typography
          variant="b3"
          weight="bold"
          className="text-neutral-500 text-center mb-6"
        >
          Otomatis ke subtes selanjutnya dalam
        </Typography>

        <div className="flex justify-center items-center gap-x-1 mb-4">
          <Typography
            as="span"
            variant="h3"
            weight="bold"
            className="text-neutral-700"
          >
            {timer}
          </Typography>

          <Typography variant="b3" className="text-neutral-500">
            detik
          </Typography>
        </div>

        <Progress value={timer} max={20} className="mb-6" />

        <div className="flex justify-between items-center gap-x-6 mb-8">
          <NextSubtestInfo title="Judul Subtes" description={nextSubtest.name}>
            <AssignmentIcon />
          </NextSubtestInfo>

          <NextSubtestInfo
            title="Jumlah Soal"
            description={String(nextSubtestQuestionsLength)}
          >
            <CalculateIcon />
          </NextSubtestInfo>

          <NextSubtestInfo title="Waktu Pengerjaan" description="20 menit">
            <TimerIcon />
          </NextSubtestInfo>
        </div>

        <Button onClick={handleRestAreaOnClick} className="block mx-auto">
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
    <div className="flex justify-between items-center gap-x-2">
      <div className="border border-secondary-400 rounded-full flex justify-center items-center w-10 h-10 [&_svg]:fill-secondary-400 [&_svg]:shrink-0 [&_svg]:w-5 [&_svg]:h-5">
        {children}
      </div>

      <div className="flex flex-col justify-between gap-y-0.5">
        <Typography variant="b3" weight="bold" className="text-neutral-950">
          {title}
        </Typography>
        <Typography variant="b4" className="text-neutral-500">
          {description}
        </Typography>
      </div>
    </div>
  );
}

export { RestArea };
