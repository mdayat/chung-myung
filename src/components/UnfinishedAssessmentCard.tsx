import Image from "next/image";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import type { IDBPDatabase } from "idb";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "./shadcn/Dialog";
import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";
import { BlurredCircle } from "./BlurredCircle";
import { WarningIcon } from "@components/icons/WarningIcon";
import MaskotHeadImages from "@public/maskot-head.png";
import type { AssessmentTrackerDBSchema } from "@utils/assessmentTracker";

interface UnfinishedAssessmentCardProps {
  indexedDB: IDBPDatabase<AssessmentTrackerDBSchema>;
  setHasUnfinishedAssessment: Dispatch<SetStateAction<boolean>>;
}

export function UnfinishedAssessmentCard({
  indexedDB,
  setHasUnfinishedAssessment,
}: UnfinishedAssessmentCardProps) {
  async function retakeAssessment() {
    try {
      await Promise.all([
        indexedDB.clear("subtest"),
        indexedDB.clear("question"),
      ]);
      setHasUnfinishedAssessment(false);
    } catch (error) {
      // Log the error properly
      console.log(error);
    }
  }

  return (
    <Dialog>
      <div className="relative z-0 overflow-hidden bg-neutral-25 shadow-[0_4px_16px_0_rgba(0,0,0,0.15)] rounded-3xl flex justify-between items-center py-4 px-6 mt-8">
        <BlurredCircle
          colorType="red"
          className="absolute top-1/2 -translate-y-1/2 -left-9 -z-10 w-28 h-28"
        />

        <div className="flex justify-between items-center gap-x-10">
          <WarningIcon className="fill-error-600 w-8 h-8" />

          <div className="max-w-[626px]">
            <Typography
              as="h3"
              variant="h5"
              weight="bold"
              className="text-[#590009] mb-1"
            >
              Asesmen Kesiapan Belajar Kamu Belum Terselesaikan!
            </Typography>

            <Typography variant="b3" className="text-neutral-500">
              Ingin melanjutkan atau mengulang asesmen?
            </Typography>
          </div>
        </div>

        <div className="flex justify-between items-center gap-x-4">
          <DialogTrigger asChild>
            <Button variant="secondary" size="small" className="shrink-0">
              Mulai Ulang Asesmen
            </Button>
          </DialogTrigger>

          <Button size="small" className="shrink-0" asChild>
            <Link href="/asesmen-kesiapan-belajar">Lanjutkan Asesmen</Link>
          </Button>
        </div>
      </div>

      <DialogContent>
        <Image
          src={MaskotHeadImages}
          width={180}
          height={180}
          alt="Emteka Maskot (Head)"
          className="object-cover object-center mx-auto"
        />

        <DialogHeader className="w-full max-w-96 mx-auto mb-8">
          <DialogTitle asChild>
            <Typography
              as="h3"
              variant="h5"
              weight="bold"
              className="text-neutral-700 text-center mb-2"
            >
              Apakah Kamu yakin ingin&nbsp;
              <span className="text-error-600">memulai ulang</span> asesmen?
            </Typography>
          </DialogTitle>

          <DialogDescription asChild>
            <Typography variant="b3" className="text-neutral-500 text-center">
              Semua progres sebelumnya akan hilang.
            </Typography>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between items-center gap-x-4">
          <DialogClose asChild>
            <Button variant="secondary" className="block text-center w-full">
              Batal
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              onClick={retakeAssessment}
              variant="primary"
              className="block text-center w-full"
            >
              Ya
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
