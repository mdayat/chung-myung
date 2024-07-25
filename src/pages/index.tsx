import { AssessmentRulesPopup } from "@components/AssessmentRulesPopup";
import { BlurredCircle } from "@components/BlurredCircle";
import { HomeHeroBanner } from "@components/HomeHeroBanner";
import { ChevronRightIcon } from "@components/icons/ChevronRightIcon";
import { EmojiFlagsIcon } from "@components/icons/EmojiFlagsIcon";
import { SchoolIcon } from "@components/icons/SchoolIcon";
import { Button } from "@components/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@components/shadcn/Dialog";
import { Typography } from "@components/shadcn/Typography";
import MaskotBodyImage from "@public/maskot-body.png";
import {
  type AssessmentTrackerDBSchema,
  openAssessmentTrackerDB,
} from "@utils/assessmentTracker";
import { deleteDB, type IDBPDatabase } from "idb";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const UnfinishedAssessmentCard = dynamic(() =>
  import("@components/UnfinishedAssessmentCard").then(
    ({ UnfinishedAssessmentCard }) => UnfinishedAssessmentCard,
  ),
);

function Home() {
  const [indexedDB, setIndexedDB] =
    useState<IDBPDatabase<AssessmentTrackerDBSchema>>();

  const [isLoading, setIsLoading] = useState(true);
  const [hasUnfinishedAssessment, setHasUnfinishedAssessment] = useState(false);

  useEffect(() => {
    if ("indexedDB" in window === false) {
      alert("your browser doesn't support indexedDB");
    } else {
      (async () => {
        try {
          const db = await openAssessmentTrackerDB();
          const subtests = await db.getAll("subtest");
          if (subtests.length !== 0) {
            setIndexedDB(db);
            setHasUnfinishedAssessment(true);
          }
        } catch (error) {
          // Log the error properly
          console.log(error);
        }
        setIsLoading(false);
      })();
    }
  }, []);

  return (
    <div className='mt-16'>
      <HomeHeroBanner />

      <button
        onClick={() => {
          deleteDB("assessment-tracker");
        }}
      >
        DROP DB
      </button>

      <div className='mx-auto w-full max-w-[calc(1366px-160px)]'>
        <Dialog>
          <div className='relative z-0 mt-8 flex h-full max-h-64 items-center gap-16 overflow-hidden rounded-3xl bg-neutral-25 shadow-[0_4px_16px_0_rgba(0,0,0,0.15)]'>
            <BlurredCircle className='absolute -bottom-[256px] -left-[256px] -z-10 h-[512px] w-[512px]' />
            <Image
              src={MaskotBodyImage}
              alt='Emteka Maskot (Full Body)'
              width={422}
              height={390}
              className='translate-y-14 object-cover object-center'
            />

            <div className='flex w-full max-w-[617px] flex-col justify-between'>
              <Typography
                as='h2'
                variant='h3'
                weight='bold'
                className='mb-4 text-neutral-700'
              >
                Mulai Belajar
              </Typography>

              <Typography
                variant='b2'
                weight='normal'
                className='mb-6 text-neutral-500'
              >
                Mari mulai belajar! Ikuti asesmen kesiapan belajar, pelajari
                materi yang kami sediakan, dan selesaikan dengan final asesmen.
              </Typography>

              <DialogTrigger asChild>
                <Button
                  disabled={isLoading || hasUnfinishedAssessment}
                  type='button'
                  className='mb-2 w-fit'
                >
                  Mulai Asesmen Kesiapan Belajar
                  <ChevronRightIcon />
                </Button>
              </DialogTrigger>

              <Typography variant='caption' className='text-neutral-400'>
                &#x2a;Saat ini, kamu hanya bisa belajar materi Bidang Ruang.
                Materi tambahan akan segera hadir!
              </Typography>
            </div>
          </div>

          <DialogContent>
            <AssessmentRulesPopup />
          </DialogContent>
        </Dialog>

        {hasUnfinishedAssessment ? (
          <UnfinishedAssessmentCard
            indexedDB={indexedDB!}
            setHasUnfinishedAssessment={setHasUnfinishedAssessment}
          />
        ) : (
          <></>
        )}

        <div className='mt-8 grid grid-cols-2 gap-x-8'>
          <AssessmentResultCard
            isLoading={isLoading}
            type='asesmen-kesiapan-belajar'
          />
          <AssessmentResultCard isLoading={isLoading} type='asesmen-akhir' />
        </div>
      </div>
    </div>
  );
}

interface AssessmentResultCardProps {
  type: "asesmen-kesiapan-belajar" | "asesmen-akhir";
  isLoading: boolean;
}

function AssessmentResultCard({ type, isLoading }: AssessmentResultCardProps) {
  return (
    <div className='relative z-0 overflow-hidden rounded-3xl bg-neutral-25 px-5 py-[26px] shadow-[0_4px_16px_0_rgba(0,0,0,0.15)]'>
      <BlurredCircle className='absolute -left-9 -top-9 -z-10 h-28 w-28' />
      <div className='flex h-full items-center justify-between gap-x-10'>
        {type === "asesmen-kesiapan-belajar" ? (
          <EmojiFlagsIcon className='h-8 w-8 shrink-0 self-start fill-secondary-600' />
        ) : (
          <SchoolIcon className='h-8 w-8 shrink-0 self-start fill-secondary-600' />
        )}

        <div className='flex h-full w-full items-center justify-between'>
          <div className='flex w-full max-w-72 flex-col justify-between self-start'>
            <Typography
              as='h3'
              variant='h5'
              weight='bold'
              className='mb-2 text-neutral-700'
            >
              {type === "asesmen-kesiapan-belajar"
                ? "Hasil Asesmen Kesiapan Belajar"
                : "Hasil Final Asesmen"}
            </Typography>

            <Typography as='h3' variant='b3' className='text-neutral-500'>
              {type === "asesmen-kesiapan-belajar"
                ? "Lihat kembali hasil asesmen kesiapan belajar yang telah kamu kerjakan."
                : "Lihat kembali bukti dari perjuanganmu belajar di Emteka."}
            </Typography>
          </div>

          <Button
            disabled={isLoading || true}
            size='medium'
            className='shrink-0'
          >
            Lihat hasil <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
