import { WarningIcon } from "@components/icons/WarningIcon";
import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";
import MaskotHeadImages from "@public/maskot-head.png";
import type {
  AssessmentDetail,
  AssessmentTrackerDBSchema,
} from "@utils/assessmentTracker";
import type { IDBPDatabase } from "idb";
import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";

import { BlurredCircle } from "./BlurredCircle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./shadcn/Dialog";

interface UnfinishedAssessmentCardProps {
  learningJourneyID: string;
  indexedDB: IDBPDatabase<AssessmentTrackerDBSchema>;
  assessmentDetail: Omit<AssessmentDetail, "timer">;
  setUnfinishedAssessmentDetail: Dispatch<
    SetStateAction<Omit<AssessmentDetail, "timer"> | null>
  >;
}

export function UnfinishedAssessmentCard({
  assessmentDetail,
  learningJourneyID,
  indexedDB,
  setUnfinishedAssessmentDetail,
}: UnfinishedAssessmentCardProps) {
  async function resetAssessment() {
    try {
      Promise.all([
        await indexedDB!.clear("subtest"),
        await indexedDB!.clear("question"),
        await indexedDB!.clear("assessmentDetail"),
      ]);
      setUnfinishedAssessmentDetail(null);
    } catch (error) {
      console.error(
        new Error(`Error when click "Mulai Ulang Asesmen" button: `, {
          cause: error,
        }),
      );
    }
  }

  return (
    <Dialog>
      <div className='relative z-0 mt-8 flex items-center justify-between overflow-hidden rounded-3xl bg-neutral-25 px-6 py-4 shadow-[0_4px_16px_0_rgba(0,0,0,0.15)]'>
        <BlurredCircle
          colorType='red'
          className='absolute -left-9 top-1/2 -z-10 h-28 w-28 -translate-y-1/2'
        />

        <div className='flex items-center justify-between gap-x-10'>
          <WarningIcon className='h-8 w-8 fill-error-600' />

          <div className='max-w-[626px]'>
            <Typography
              as='h3'
              variant='h5'
              weight='bold'
              className='mb-1 text-[#590009]'
            >
              {assessmentDetail.type === "asesmen_kesiapan_belajar"
                ? "Asesmen Kesiapan Belajar"
                : "Asesmen Akhir"}
              &nbsp;Kamu Belum Terselesaikan!
            </Typography>

            <Typography variant='b3' className='text-neutral-500'>
              Ingin melanjutkan atau mengulang asesmen?
            </Typography>
          </div>
        </div>

        <div className='flex items-center justify-between gap-x-4'>
          <DialogTrigger asChild>
            <Button variant='secondary' size='small' className='shrink-0'>
              Mulai Ulang Asesmen
            </Button>
          </DialogTrigger>

          <Button size='small' className='shrink-0' asChild>
            <Link href={`/${learningJourneyID}/asesmen/${assessmentDetail.id}`}>
              Lanjutkan Asesmen
            </Link>
          </Button>
        </div>
      </div>

      <DialogContent>
        <Image
          src={MaskotHeadImages}
          width={180}
          height={180}
          alt='Emteka Maskot (Head)'
          className='mx-auto object-cover object-center'
        />

        <DialogHeader className='mx-auto mb-8 w-full max-w-96'>
          <DialogTitle asChild>
            <Typography
              as='h3'
              variant='h5'
              weight='bold'
              className='mb-2 text-center text-neutral-700'
            >
              Apakah Kamu yakin ingin&nbsp;
              <span className='text-error-600'>memulai ulang</span> asesmen?
            </Typography>
          </DialogTitle>

          <DialogDescription asChild>
            <Typography variant='b2' className='text-center text-neutral-500'>
              Semua progres sebelumnya akan hilang.
            </Typography>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='flex items-center justify-between gap-x-4'>
          <DialogClose asChild>
            <Button variant='secondary' className='block w-full text-center'>
              Batal
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              onClick={resetAssessment}
              variant='primary'
              className='block w-full text-center'
            >
              Ya
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
