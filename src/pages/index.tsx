import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { IDBPDatabase } from "idb";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@components/shadcn/Dialog";
import { Typography } from "@components/shadcn/Typography";
import { Button } from "@components/shadcn/Button";
import { HomeHeroBanner } from "@components/HomeHeroBanner";
import { BlurredCircle } from "@components/BlurredCircle";
import { ChevronRightIcon } from "@components/icons/ChevronRightIcon";
import {
  openAssessmentTrackerDB,
  type AssessmentTrackerDBSchema,
} from "@utils/assessmentTracker";
import { EmojiFlagsIcon } from "@components/icons/EmojiFlagsIcon";
import { SchoolIcon } from "@components/icons/SchoolIcon";
import MaskotBodyImage from "@public/maskot-body.png";
import { AssessmentRulesPopup } from "@components/AssessmentRulesPopup";

const UnfinishedAssessmentCard = dynamic(() =>
  import("@components/UnfinishedAssessmentCard").then(
    ({ UnfinishedAssessmentCard }) => UnfinishedAssessmentCard
  )
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
    <div className="mt-16">
      <HomeHeroBanner />

      <div className="w-full max-w-[calc(1366px-160px)] mx-auto">
        <Dialog>
          <div className="relative z-0 overflow-hidden bg-neutral-25 rounded-3xl shadow-[0_4px_16px_0_rgba(0,0,0,0.15)] flex items-center gap-16 h-full max-h-64 mt-8">
            <BlurredCircle className="absolute -bottom-[256px] -left-[256px] -z-10 w-[512px] h-[512px]" />
            <Image
              src={MaskotBodyImage}
              alt="Emteka Maskot (Full Body)"
              width={422}
              height={390}
              className="object-cover object-center translate-y-14"
            />

            <div className="flex flex-col justify-between w-full max-w-[617px]">
              <Typography
                as="h2"
                variant="h3"
                weight="bold"
                className="text-neutral-700 mb-4"
              >
                Mulai Belajar
              </Typography>

              <Typography
                variant="b2"
                weight="normal"
                className="text-neutral-500 mb-6"
              >
                Mari mulai belajar! Ikuti asesmen kesiapan belajar, pelajari
                materi yang kami sediakan, dan selesaikan dengan final asesmen.
              </Typography>

              <DialogTrigger asChild>
                <Button
                  disabled={isLoading || hasUnfinishedAssessment}
                  type="button"
                  className="w-fit mb-2"
                >
                  Mulai Asesmen Kesiapan Belajar
                  <ChevronRightIcon />
                </Button>
              </DialogTrigger>

              <Typography variant="caption" className="text-neutral-400">
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

        <div className="grid grid-cols-2 gap-x-8 mt-8">
          <AssessmentResultCard
            isLoading={isLoading}
            type="asesmen-kesiapan-belajar"
          />
          <AssessmentResultCard isLoading={isLoading} type="asesmen-akhir" />
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
    <div className="relative z-0 overflow-hidden bg-neutral-25 shadow-[0_4px_16px_0_rgba(0,0,0,0.15)] rounded-3xl px-5 py-[26px]">
      <BlurredCircle className="absolute -top-9 -left-9 -z-10 w-28 h-28" />
      <div className="flex justify-between items-center gap-x-10 h-full">
        {type === "asesmen-kesiapan-belajar" ? (
          <EmojiFlagsIcon className="shrink-0 self-start fill-secondary-600 w-8 h-8" />
        ) : (
          <SchoolIcon className="shrink-0 self-start fill-secondary-600 w-8 h-8" />
        )}

        <div className="flex justify-between items-center w-full h-full">
          <div className="self-start flex flex-col justify-between w-full max-w-72">
            <Typography
              as="h3"
              variant="h5"
              weight="bold"
              className="text-neutral-700 mb-2"
            >
              {type === "asesmen-kesiapan-belajar"
                ? "Hasil Asesmen Kesiapan Belajar"
                : "Hasil Final Asesmen"}
            </Typography>

            <Typography as="h3" variant="b3" className="text-neutral-500">
              {type === "asesmen-kesiapan-belajar"
                ? "Lihat kembali hasil asesmen kesiapan belajar yang telah kamu kerjakan."
                : "Lihat kembali bukti dari perjuanganmu belajar di Emteka."}
            </Typography>
          </div>

          <Button
            disabled={isLoading || true}
            size="medium"
            className="shrink-0"
          >
            Lihat hasil <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
