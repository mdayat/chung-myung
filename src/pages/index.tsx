import { AssessmentRulesPopup } from "@components/AssessmentRulesPopup";
import { BlurredCircle } from "@components/BlurredCircle";
import { HomeHeroBanner } from "@components/HomeHeroBanner";
import { ChevronRightIcon } from "@components/icons/ChevronRightIcon";
import { EmojiFlagsIcon } from "@components/icons/EmojiFlagsIcon";
import { LoaderSpinner } from "@components/icons/LoaderSpinner";
import { SchoolIcon } from "@components/icons/SchoolIcon";
import { HelpMenu, Navbar, ProfileMenu } from "@components/Navbar";
import { Button } from "@components/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@components/shadcn/Dialog";
import { Typography } from "@components/shadcn/Typography";
import type { SuccessResponse } from "@customTypes/api";
import type {
  AssessmentResult,
  AssessmentType,
} from "@customTypes/assessmentResult";
import type { LearningJourney } from "@customTypes/learningJourney";
import MaskotBodyImage from "@public/maskot-body.png";
import {
  type AssessmentDetail,
  type AssessmentTrackerDBSchema,
  openAssessmentTrackerDB,
} from "@utils/assessmentTracker";
import { karla, nunito } from "@utils/fonts";
import axios, { type AxiosError } from "axios";
import { deleteDB, type IDBPDatabase } from "idb";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement, useEffect, useState } from "react";

import type { NextPageWithLayout } from "./_app";

const UnfinishedAssessmentCard = dynamic(() =>
  import("@components/UnfinishedAssessmentCard").then(
    ({ UnfinishedAssessmentCard }) => UnfinishedAssessmentCard,
  ),
);

const Home: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [indexedDB, setIndexedDB] =
    useState<IDBPDatabase<AssessmentTrackerDBSchema>>();

  const [akbResult, setAkbResult] = useState<AssessmentResult | null>(null);
  const [asesmenAkhirResult, setAsesmenAkhirResult] =
    useState<AssessmentResult | null>(null);

  const [learningJourneyID, setLearningJourneyID] = useState("");
  const [unfinishedAssessmentDetail, setUnfinishedAssessmentDetail] =
    useState<Omit<AssessmentDetail, "timer"> | null>(null);

  useEffect(() => {
    (async () => {
      // Check if user has learning journeys
      let learningJourneyID = "";
      try {
        const { data: learningJourneysResponse } = await axios.get<
          SuccessResponse<LearningJourney[]>
        >("/api/learning-journeys");
        if (learningJourneysResponse.data.length !== 0) {
          learningJourneyID = learningJourneysResponse.data[0].id;
          setLearningJourneyID(learningJourneysResponse.data[0].id);
        }
      } catch (err) {
        const error = err as AxiosError;
        if (error.response) {
          // retry the request
        } else if (error.request) {
          // retry the request
        } else {
          console.error(
            new Error("Something is wrong with Axios: ", { cause: error }),
          );
        }
      }

      // Check if user has assessment results based on a learning journey
      let asesmenAkhirResult: AssessmentResult | null = null;
      if (learningJourneyID !== "") {
        try {
          const { data: assessmentResultsResponse } = await axios.get<
            SuccessResponse<AssessmentResult[]>
          >(`/api/learning-journeys/${learningJourneyID}/assessment-results`);
          if (assessmentResultsResponse.data.length !== 0) {
            for (const assessmentResult of assessmentResultsResponse.data) {
              if (assessmentResult.type === "asesmen_kesiapan_belajar") {
                setAkbResult(assessmentResult);
              } else {
                setAsesmenAkhirResult(assessmentResult);
                asesmenAkhirResult = assessmentResult;
              }
            }
          }
        } catch (err) {
          const error = err as AxiosError;
          if (error.response) {
            // retry the request
          } else if (error.request) {
            // retry the request
          } else {
            console.error(
              new Error("Something is wrong with Axios: ", { cause: error }),
            );
          }
        }
      }

      if ("indexedDB" in window === false) {
        alert("your browser doesn't support indexedDB");
      } else {
        try {
          const db = await openAssessmentTrackerDB();
          setIndexedDB(db);

          if (learningJourneyID === "") return;
          if (asesmenAkhirResult !== null) return;

          const assessmentDetail = await db.getAll("assessmentDetail");
          if (assessmentDetail.length !== 0) {
            setUnfinishedAssessmentDetail(assessmentDetail[0]);
          }
        } catch (error) {
          console.error(
            new Error(
              "Error when check if there is an unfinished assessment: ",
              { cause: error },
            ),
          );
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center'>
        <LoaderSpinner className='mb-6 h-16 w-16' />
        <Typography as='h2' variant='h5' weight='bold' className='mb-2'>
          Tunggu sebentar ya!
        </Typography>
      </div>
    );
  }

  return (
    <>
      <Navbar>
        <HelpMenu />
        <ProfileMenu withIcon />
      </Navbar>

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
                materi yang kami sediakan, dan selesaikan dengan asesmen akhir.
              </Typography>

              {asesmenAkhirResult !== null ||
              (akbResult !== null && akbResult.score === 100) ||
              (akbResult !== null && akbResult.attempt === 3) ? (
                <Button asChild type='button' className='mb-2 w-fit'>
                  <Link href={`/${learningJourneyID}/belajar-materi`}>
                    Belajar Materi
                    <ChevronRightIcon />
                  </Link>
                </Button>
              ) : (
                <DialogTrigger asChild>
                  <Button
                    disabled={
                      akbResult !== null || unfinishedAssessmentDetail !== null
                    }
                    type='button'
                    className='mb-2 w-fit'
                  >
                    Mulai Asesmen Kesiapan Belajar
                    <ChevronRightIcon />
                  </Button>
                </DialogTrigger>
              )}

              <Typography variant='caption' className='text-neutral-400'>
                &#x2a;Saat ini, kamu hanya bisa belajar materi Bidang Ruang.
                Materi tambahan akan segera hadir!
              </Typography>
            </div>
          </div>

          <DialogContent>
            <AssessmentRulesPopup
              indexedDB={indexedDB!}
              learningJourneyID={learningJourneyID}
            />
          </DialogContent>
        </Dialog>

        {unfinishedAssessmentDetail !== null ? (
          <UnfinishedAssessmentCard
            learningJourneyID={unfinishedAssessmentDetail.learningJourneyID}
            indexedDB={indexedDB!}
            assessmentDetail={unfinishedAssessmentDetail}
            setUnfinishedAssessmentDetail={setUnfinishedAssessmentDetail}
          />
        ) : (
          <></>
        )}

        <div className='mt-8 grid grid-cols-2 gap-x-8'>
          <AssessmentResultCard
            isLoading={isLoading}
            type='asesmen_kesiapan_belajar'
          />
          <AssessmentResultCard isLoading={isLoading} type='asesmen_akhir' />
        </div>
      </div>
    </>
  );
};

interface AssessmentResultCardProps {
  type: AssessmentType;
  isLoading: boolean;
}

function AssessmentResultCard({ type, isLoading }: AssessmentResultCardProps) {
  return (
    <div className='relative z-0 overflow-hidden rounded-3xl bg-neutral-25 px-5 py-[26px] shadow-[0_4px_16px_0_rgba(0,0,0,0.15)]'>
      <BlurredCircle className='absolute -left-9 -top-9 -z-10 h-28 w-28' />
      <div className='flex h-full items-center justify-between gap-x-10'>
        {type === "asesmen_kesiapan_belajar" ? (
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
              {type === "asesmen_kesiapan_belajar"
                ? "Hasil Asesmen Kesiapan Belajar"
                : "Hasil Asesmen Akhir"}
            </Typography>

            <Typography as='h3' variant='b3' className='text-neutral-500'>
              {type === "asesmen_kesiapan_belajar"
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

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <main className={`${karla.variable} ${nunito.variable} font-karla`}>
      {page}
    </main>
  );
};

export default Home;
